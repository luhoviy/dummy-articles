import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Article, ArticleCategory } from '../shared/models';
import { ARTICLE_CATEGORIES_LIST } from '../shared/constants';
import { isEqual, orderBy } from 'lodash';
import { interval, Observable, of } from 'rxjs';
import { getIsNetworkOnline } from '../../../../store/selectors/app.selectors';
import { Store } from '@ngrx/store';
import { ClearObservable } from '../../../../shared/components/clear-observable.component';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, map, startWith, take, takeUntil } from 'rxjs/operators';
import firebase from 'firebase/compat';
import { ParseFirebaseErrorMessage } from '../../../../shared/utils';
import { NotificationsService } from '../../../../shared/services/notifications.service';
import { ArticlesService } from '../shared/articles.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { getCurrentUser } from '../../../../authentication/store';
import { User } from '../../../../authentication/shared/auth.model';
import { HumanizedTimePipe } from '../../../../shared/pipes/humanized-time/humanized-time.pipe';
import * as moment from 'moment';

export interface ArticleEditorFormValue {
  title: string;
  description: string;
  category: ArticleCategory;
  temporaryCoverPhotoPath: string;
}

@Component({
  selector: 'app-article-editor',
  templateUrl: './article-editor.component.html',
  styleUrls: ['./article-editor.component.scss'],
})
export class ArticleEditorComponent extends ClearObservable implements OnInit {
  @Output() onSubmit = new EventEmitter<ArticleEditorFormValue>();
  readonly categories: ArticleCategory[] = orderBy(ARTICLE_CATEGORIES_LIST);
  readonly isNetworkOnline$: Observable<boolean> =
    this.store.select(getIsNetworkOnline);
  readonly currentUser$: Observable<User> = this.store.select(getCurrentUser);
  isEditMode: boolean;
  lastEdited$: Observable<string>;
  article: Article;
  form: FormGroup;
  temporaryCoverPhotoPath: string;

  constructor(
    private fb: FormBuilder,
    private activateRoute: ActivatedRoute,
    private store: Store,
    private router: Router,
    private notifications: NotificationsService,
    private articlesService: ArticlesService,
    private spinner: NgxSpinnerService,
    private humanizedTimePipe: HumanizedTimePipe
  ) {
    super();
    this.activateRoute.data.pipe(take(1)).subscribe((data) => {
      const { isEditMode, article } = data;
      this.isEditMode = isEditMode;

      if (!!article) {
        this.article = { ...article };
        this.temporaryCoverPhotoPath = this.article.coverPhotoUrl;

        if (!!this.article.editedAt) {
          this.lastEdited$ =
            moment
              .duration(moment(this.article.editedAt).diff(moment()))
              .get('hours') < 0
              ? of(this.humanizedTimePipe.transform(this.article.editedAt))
              : interval(30 * 1000).pipe(
                  startWith(0),
                  map(() =>
                    this.humanizedTimePipe.transform(this.article.editedAt)
                  )
                );
        }
      }
    });
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      title: [
        this.article ? this.article.title : '',
        [Validators.required, Validators.minLength(2)],
      ],
      description: [
        this.article ? this.article.description : '',
        [Validators.required, Validators.minLength(10)],
      ],
      category: [
        this.article ? this.article.category : null,
        Validators.required,
      ],
    });
  }

  async createArticle(): Promise<void> {
    if (!this.temporaryCoverPhotoPath) {
      this.notifications.error(
        'Please upload an article cover photo to proceed.'
      );
      return;
    }

    await this.spinner.show();

    const article = {
      ...new Article(),
      ...this.form.value,
      coverPhotoUrl: this.temporaryCoverPhotoPath,
    };

    this.articlesService
      .createArticle(article)
      .pipe(
        finalize(() => this.spinner.hide()),
        take(1),
        takeUntil(this.destroy$)
      )
      .subscribe(
        (article) => {
          this.notifications.success('Article has been successfully created!');
          this.redirectToArticlePage(article);
        },
        (err: firebase.FirebaseError) => {
          this.notifications.error(ParseFirebaseErrorMessage(err));
        }
      );
  }

  async saveArticle(): Promise<void> {
    const newCoverPhotoPath =
      this.article.coverPhotoUrl !== this.temporaryCoverPhotoPath
        ? this.temporaryCoverPhotoPath
        : null;
    const editedArticle = {
      ...this.article,
      ...this.form.value,
    };

    if (isEqual(editedArticle, this.article) && !newCoverPhotoPath) {
      this.redirectToArticlePage(this.article);
      return;
    }

    await this.spinner.show();
    this.articlesService
      .saveArticle(editedArticle, newCoverPhotoPath)
      .pipe(
        finalize(() => this.spinner.hide()),
        take(1),
        takeUntil(this.destroy$)
      )
      .subscribe(
        (article) => {
          this.notifications.success('Article has been successfully updated!');
          this.redirectToArticlePage(article);
        },
        (err: firebase.FirebaseError) => {
          this.notifications.error(ParseFirebaseErrorMessage(err));
        }
      );
  }

  private redirectToArticlePage(article: Article): void {
    this.currentUser$.pipe(take(1)).subscribe((user) => {
      article.author = user;
      this.router.navigate(['display/articles', article.id], {
        state: { article },
      });
    });
  }
}
