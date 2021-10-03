import { Injectable } from '@angular/core';
import { Article } from './models';
import { fromPromise } from 'rxjs/internal-compatibility';
import { catchError, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { getCurrentUser } from '../../../../authentication/store';
import { FileUploaderService } from '../../../../shared/services/file-uploader.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class ArticlesService {
  constructor(
    private store: Store,
    private db: AngularFirestore,
    private fileUploaderService: FileUploaderService
  ) {}

  public createArticle(article: Article): Observable<Article> {
    const coverPhotoUrl = article.coverPhotoUrl;
    delete article.coverPhotoUrl;
    article.createdAt = new Date().toUTCString();

    return fromPromise(this.db.collection('articles').add(article)).pipe(
      withLatestFrom(this.store.select(getCurrentUser)),
      mergeMap(([res, user]) => {
        article.id = res.id;
        article.authorId = user.id;
        return this.fileUploaderService
          .uploadFileToFireStorage(
            `users/${user.id}/articles/${article.id}`,
            coverPhotoUrl
          )
          .pipe(
            catchError(() => of(null)),
            mergeMap((coverPhotoUrlResponse: string | null) => {
              article.coverPhotoUrl = coverPhotoUrlResponse;
              return fromPromise(
                this.db.doc(`articles/${res.id}`).update(article)
              ).pipe(
                map(() => {
                  article.author = user;
                  return article;
                })
              );
            })
          );
      })
    );
  }

  public saveArticle(
    article: Article,
    temporaryCoverPhotoPath?: string
  ): Observable<Article> {
    return (
      !!temporaryCoverPhotoPath
        ? this.fileUploaderService.uploadFileToFireStorage(
            `users/${article.authorId}/articles/${article.id}`,
            temporaryCoverPhotoPath
          )
        : of(article.coverPhotoUrl)
    ).pipe(
      mergeMap((photoUrl) => {
        article.coverPhotoUrl = photoUrl;
        article.editedAt = new Date().toUTCString();
        return fromPromise(
          this.db.doc(`articles/${article.id}`).update(article)
        ).pipe(map(() => article));
      })
    );
  }

  public deleteArticle(id: string): Observable<void> {
    return fromPromise(this.db.doc(`articles/${id}`).delete());
  }

  public getArticle(id: string): Observable<Article> {
    return this.db
      .doc<Article>(`articles/${id}`)
      .get()
      .pipe(map((res) => res.data()));
  }
}
