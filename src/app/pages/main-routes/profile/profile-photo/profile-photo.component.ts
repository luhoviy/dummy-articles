import { Component, OnInit } from '@angular/core';
import { ClearObservable } from '../../../../shared/components/clear-observable.component';
import { Store } from '@ngrx/store';
import * as fromAuthFeature from '../../../../authentication/store';
import {
  AuthProviderType,
  User,
} from '../../../../authentication/shared/auth.model';
import { catchError, filter, map, take, takeUntil } from 'rxjs/operators';
import { flatten, values } from 'lodash';
import firebase from 'firebase/compat/app';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { BreakpointObserver } from '@angular/cdk/layout';
import { FileUploaderService } from '../../../../shared/services/file-uploader.service';
import { Observable, of } from 'rxjs';
import { getIsNetworkOnline } from '../../../../store/selectors/app.selectors';
import { updateLoadingState } from '../../../../store/actions/app.actions';

@Component({
  selector: 'app-profile-photo',
  templateUrl: './profile-photo.component.html',
  styleUrls: ['./profile-photo.component.scss'],
})
export class ProfilePhotoComponent extends ClearObservable implements OnInit {
  user: User;
  providers: firebase.UserInfo[] = [];
  isDesktop: boolean;
  newPhotoUrl: string = null;
  uploadedPhotoPath: string = null;
  isNetworkOnline$: Observable<boolean> = this.store.select(getIsNetworkOnline);

  constructor(
    private store: Store,
    private breakpointObserver: BreakpointObserver,
    private fileUploader: FileUploaderService
  ) {
    super();
  }

  ngOnInit(): void {
    this.breakpointObserver
      .observe('(min-width:700px)')
      .pipe(
        map((res) => res.matches),
        takeUntil(this.destroy$)
      )
      .subscribe((isDesktop) => (this.isDesktop = isDesktop));

    this.store
      .select(fromAuthFeature.getCurrentUser)
      .pipe(
        filter((user) => !!user),
        takeUntil(this.destroy$)
      )
      .subscribe((user) => {
        this.user = { ...user };
        this.providers = flatten(values(user.providersDataMap)).filter(
          (provider) =>
            provider.providerId !== AuthProviderType.PASSWORD &&
            provider.photoURL !== user.photoUrl
        );
        this.newPhotoUrl = null;
        this.uploadedPhotoPath = null;
      });
  }

  public applySuggestedPhoto(
    photoURL: string,
    $event: MatSlideToggleChange
  ): void {
    this.newPhotoUrl = $event.checked ? photoURL : this.uploadedPhotoPath;
  }

  public save(): void {
    if (this.newPhotoUrl === this.uploadedPhotoPath) {
      this.store.dispatch(updateLoadingState({ isLoading: true }));
      this.fileUploader
        .uploadFileToFireStorage(
          `users/${this.user.id}/avatar`,
          this.uploadedPhotoPath
        )
        .pipe(
          take(1),
          takeUntil(this.destroy$),
          catchError((error) => {
            console.log('uploadFileToFireStorage error', error);
            this.store.dispatch(updateLoadingState({ isLoading: false }));
            return of(error);
          })
        )
        .subscribe((res) => this.saveUserPhotoUrlToDb(res));
      return;
    }

    this.saveUserPhotoUrlToDb(this.newPhotoUrl);
  }

  private saveUserPhotoUrlToDb(newPhotoUrl: string): void {
    this.user.photoUrl = newPhotoUrl;
    this.store.dispatch(
      fromAuthFeature.saveUserToDb({ user: this.user, setLoadingState: true })
    );
  }
}
