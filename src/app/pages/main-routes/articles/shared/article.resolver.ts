import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Article } from './models';
import { ArticlesService } from './articles.service';
import { catchError, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { AuthService } from '../../../../authentication/services/auth.service';
import { NotificationsService } from '../../../../shared/services/notifications.service';
import { Store } from '@ngrx/store';
import { getCurrentUser } from '../../../../authentication/store';
import { ParseFirebaseErrorMessage } from '../../../../shared/utils';

@Injectable({
  providedIn: 'root',
})
export class ArticleResolver implements Resolve<Article> {
  constructor(
    private router: Router,
    private store: Store,
    private articlesService: ArticlesService,
    private authService: AuthService,
    private notifications: NotificationsService
  ) {}

  private redirect(): void {
    this.router.navigate(['/display/articles']);
  }

  resolve(route: ActivatedRouteSnapshot): Observable<Article> {
    const { isCreateMode, isEditMode } = route.data;
    if (isCreateMode) {
      return of(null);
    }

    let extractedArticleData: Article =
      this.router.getCurrentNavigation().extras.state?.article;
    if (!!extractedArticleData) {
      extractedArticleData = { ...extractedArticleData };
      if (isEditMode) {
        delete extractedArticleData.author;
      }
      return of(extractedArticleData);
    }

    const id = route.paramMap.get('id');
    return this.articlesService.getArticle(id).pipe(
      withLatestFrom(this.store.select(getCurrentUser)),
      mergeMap(([article, currentUser]) => {
        if (!!article) {
          if (isEditMode) {
            if (article.authorId !== currentUser.id) {
              this.notifications.error(
                "Forbidden: You don't have permissions to edit this article!"
              );
              this.redirect();
              return of(null);
            }

            return of(article);
          }

          return article.authorId === currentUser.id
            ? of(article).pipe(
                map((article) => {
                  article.author = currentUser;
                  return article;
                })
              )
            : this.authService.getUserFromDb(article.authorId).pipe(
                map((user) => {
                  article.author = user;
                  return article;
                })
              );
        }

        this.notifications.error(
          'Article does not exist or has recently been deleted!'
        );
        this.redirect();
        return of(null);
      }),
      catchError((err) => {
        this.notifications.error(ParseFirebaseErrorMessage(err));
        this.redirect();
        return err;
      })
    );
  }
}
