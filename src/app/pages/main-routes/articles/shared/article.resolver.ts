import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Article } from './models';

@Injectable({
  providedIn: 'root',
})
export class ArticleResolver implements Resolve<Article> {
  constructor(private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Article> {
    const extractedArticleData: Article =
      this.router.getCurrentNavigation().extras.state?.article;
    if (!!extractedArticleData) {
      return of(extractedArticleData);
    }

    const id = route.paramMap.get('id');
    return of(null);
  }
}
