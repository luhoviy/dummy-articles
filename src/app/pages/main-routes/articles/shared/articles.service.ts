import { Injectable } from '@angular/core';
import { Article } from './models';
import { fromPromise } from 'rxjs/internal-compatibility';
import {
  catchError,
  map,
  mergeMap,
  take,
  withLatestFrom,
} from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { getCurrentUser } from '../../../../authentication/store';
import { FileUploaderService } from '../../../../shared/services/file-uploader.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../../../../authentication/shared/auth.model';
import { compact, isEmpty, uniq } from 'lodash';
import algoliasearch, { SearchIndex } from 'algoliasearch';
import * as fromArticlesFeature from '../store';
import { getIsNetworkOnline } from '../../../../store/selectors/app.selectors';

const ALGOLIA_CLIENT = algoliasearch(
  'FAEOZ8N1P9',
  'e6a0d47dc46d38b1db8b7921bff463a7'
);

@Injectable({
  providedIn: 'root',
})
export class ArticlesService {
  private static readonly ArticlesSearchClient: SearchIndex =
    ALGOLIA_CLIENT.initIndex('Articles');

  constructor(
    private store: Store,
    private db: AngularFirestore,
    private fileUploaderService: FileUploaderService
  ) {}

  public createArticle(article: Article): Observable<Article> {
    const coverPhotoUrl = article.coverPhotoUrl;
    delete article.coverPhotoUrl;
    article.createdAt = new Date().getTime();

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
        article.editedAt = new Date().getTime();
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

  getArticlesList(idsListOfSearchArticles: string[]): Observable<Article[]> {
    if (idsListOfSearchArticles.length > 10)
      idsListOfSearchArticles.length = 10;
    return this.store.select(fromArticlesFeature.getSearchConfig).pipe(
      take(1),
      mergeMap((config) => {
        const collection = this.db.collection<Article>('articles', (ref) =>
          !!idsListOfSearchArticles.length
            ? ref
                .where('id', 'in', idsListOfSearchArticles)
                .orderBy('createdAt', config.sortOrder)
            : config.selectedCategory !== 'ALL'
            ? ref
                .where('category', '==', config.selectedCategory)
                .orderBy('createdAt', config.sortOrder)
            : ref.orderBy('createdAt', config.sortOrder)
        );

        return collection.snapshotChanges().pipe(
          withLatestFrom(
            this.store.select(fromArticlesFeature.getArticleAuthors)
          ),
          mergeMap(([articles, authors]) => {
            if (isEmpty(articles)) {
              return of([]);
            }

            const list = articles.map((doc) => doc.payload.doc.data());
            if (
              list.length &&
              !list.every((article) =>
                authors.some((user) => user.id === article.authorId)
              )
            ) {
              return this.getRelatedAuthors(list);
            }

            return of(list);
          })
        );
      })
    );
  }

  public getArticleIdsBySearchKeyword(): Observable<string[]> {
    return this.store.select(fromArticlesFeature.getSearchConfig).pipe(
      withLatestFrom(this.store.select(getIsNetworkOnline)),
      mergeMap(([config, isOnline]) => {
        if (!!!config.searchKeyword || !isOnline) {
          return of([]);
        }
        const searchParams =
          config.selectedCategory !== 'ALL'
            ? { filters: `category:'${config.selectedCategory}'` }
            : null;
        return fromPromise(
          ArticlesService.ArticlesSearchClient.search<Article>(
            config.searchKeyword,
            searchParams
          )
        ).pipe(
          map((res) => res.hits.map((hit) => hit.objectID)),
          catchError(() => of([]))
        );
      }),
      take(1)
    );
  }

  private getRelatedAuthors(articles: Article[]): Observable<Article[]> {
    const authorsIds = compact(
      uniq(articles.map((article) => article.authorId))
    );
    if (authorsIds.length > 10) authorsIds.length = 10;
    return this.db
      .collection<User>('users', (ref) => ref.where('id', 'in', authorsIds))
      .get()
      .pipe(
        map((snapshot) => {
          this.store.dispatch(
            fromArticlesFeature.updateArticleAuthors({
              articleAuthors: snapshot.docs.map((doc) => doc.data()),
            })
          );
          return articles;
        }),
        take(1)
      );
  }
}
