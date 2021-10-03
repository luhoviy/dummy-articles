import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Article } from '../shared/models';
import { take, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { getCurrentUser } from '../../../../authentication/store';
import { Observable } from "rxjs";
import { getIsNetworkOnline } from "../../../../store/selectors/app.selectors";

@Component({
  selector: 'app-article-details',
  templateUrl: './article-details.component.html',
  styleUrls: ['./article-details.component.scss'],
})
export class ArticleDetailsComponent {
  readonly isNetworkOnline$: Observable<boolean> = this.store.select(getIsNetworkOnline);
  article: Article;
  isAuthor: boolean;

  constructor(activateRoute: ActivatedRoute, private store: Store) {
    activateRoute.data
      .pipe(withLatestFrom(store.select(getCurrentUser)), take(1))
      .subscribe(([{article}, user]) => {
        this.article = article;
        this.isAuthor = this.article.authorId === user.id;
      });
  }
}
