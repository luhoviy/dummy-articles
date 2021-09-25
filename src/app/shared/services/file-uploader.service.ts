import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import {
  filter,
  finalize,
  map,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FileUploaderService {
  uploadingProgress$ = new BehaviorSubject<number>(0);
  private unsubscribe: Subject<void>;

  constructor(private storage: AngularFireStorage) {}

  public uploadFileToFireStorage(
    path: string,
    fileAsDataUrl: string
  ): Observable<string> {
    this.unsubscribe = new Subject();
    const storageRef = this.storage.ref(path);
    const task = storageRef.putString(fileAsDataUrl, 'data_url', {
      cacheControl: 'private, max-age=172800',
    });

    task
      .percentageChanges()
      .pipe(
        map((percentage) => Math.round(percentage)),
        tap((percentage) => this.uploadingProgress$.next(percentage)),
        filter((percentage) => percentage === 100),
        take(1),
        takeUntil(this.unsubscribe),
        finalize(() => {
          this.unsubscribe.next();
          this.unsubscribe.complete();
          this.uploadingProgress$.next(0);
        })
      )
      .subscribe(() => null);

    return task.snapshotChanges().pipe(
      filter(
        (snapshot) =>
          snapshot.state !== 'paused' && snapshot.state !== 'running'
      ),
      switchMap((snapshot) =>
        snapshot.state === 'success' ? storageRef.getDownloadURL() : of(null)
      )
    );
  }
}
