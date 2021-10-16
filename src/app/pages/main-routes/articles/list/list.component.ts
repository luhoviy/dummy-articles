import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { ArticlesService } from '../shared/articles.service';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  skipWhile,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { Article, ArticleCategory, SearchConfig } from '../shared/models';
import { Store } from '@ngrx/store';
import * as fromArticlesFeature from '../store';
import { ClearObservable } from '../../../../shared/components/clear-observable.component';
import { User } from '../../../../authentication/shared/auth.model';
import { chunk, cloneDeep, isEqual, orderBy, toPairs } from 'lodash';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ARTICLE_CATEGORIES_LIST } from '../shared/constants';
import { getIsNetworkOnline } from '../../../../store/selectors/app.selectors';
import { getCurrentUser, getIsLoggedIn } from 'src/app/authentication/store';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import { fadeInOut } from '../../../../shared/animations';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInOut],
})
export class ListComponent extends ClearObservable implements OnInit {
  readonly categories: ArticleCategory[] = orderBy(ARTICLE_CATEGORIES_LIST);
  readonly paginatorPageSizeOptions: number[] = [5, 10, 25, 50];
  currentUser: User;
  searchForm: FormGroup;
  searchConfig: SearchConfig;
  list: Article[] = [];
  chunks: Article[][][];
  articlesPerRow: number = 3;
  currentPage: number = 0;
  pageSize: number = 5;
  paginatorChanges$ = new Subject<PageEvent>();
  isNetworkOnline: boolean;
  isLoading: boolean;

  constructor(
    private articlesService: ArticlesService,
    private store: Store,
    private fb: FormBuilder,
    private matPaginatorIntl: MatPaginatorIntl,
    private breakpointObserver: BreakpointObserver,
    private cdr: ChangeDetectorRef
  ) {
    super();
    this.matPaginatorIntl.itemsPerPageLabel = 'Articles per page';
  }

  ngOnInit(): void {
    this.initBreakPointListener();
    this.initSubscriptions();
    this.initSearchForm();
  }

  private initSubscriptions(): void {
    this.store
      .select(fromArticlesFeature.getArticlesList)
      .pipe(
        withLatestFrom(
          this.store.select(getIsLoggedIn),
          this.store.select(getCurrentUser)
        ),
        tap(([list, isLoggedIn, user]) => {
          this.currentUser = user;
          if (isLoggedIn && !list) {
            this.store.dispatch(fromArticlesFeature.getArticles());
          }
        }),
        map(([list]) => list),
        filter((list) => !!list),
        withLatestFrom(
          this.store.select(fromArticlesFeature.getArticleAuthors)
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(([list, authors]) => {
        this.list = this.mergeArticlesAndAuthors(
          cloneDeep(list),
          cloneDeep(authors)
        );
        this.divideArticlesList();
      });

    this.store
      .select(fromArticlesFeature.getSearchConfig)
      .pipe(takeUntil(this.destroy$))
      .subscribe((config) => (this.searchConfig = config));

    this.paginatorChanges$
      .pipe(
        debounceTime(300),
        distinctUntilChanged((prev, current) => isEqual(prev, current)),
        takeUntil(this.destroy$)
      )
      .subscribe((change) => {
        this.currentPage = change.pageIndex;
        const previousPageSize = this.pageSize;
        this.pageSize = change.pageSize;
        if (change.pageSize !== previousPageSize) {
          this.divideArticlesList();
          return;
        }
        this.cdr.detectChanges();
      });
  }

  private initSearchForm(): void {
    this.searchForm = this.fb.group({
      searchKeyword: [this.searchConfig.searchKeyword],
      selectedCategory: [this.searchConfig.selectedCategory],
      sortOrder: [this.searchConfig.sortOrder],
    });

    this.store
      .select(getIsNetworkOnline)
      .pipe(
        tap((isOnline) => (this.isNetworkOnline = isOnline)),
        takeUntil(this.destroy$)
      )
      .subscribe((isOnline) => {
        if (isOnline) {
          this.searchForm.controls['searchKeyword'].enable();
          return;
        }
        this.searchForm.controls['searchKeyword'].setValue('');
        this.searchForm.controls['searchKeyword'].disable();
      });

    this.store
      .select(fromArticlesFeature.getIsLoading)
      .pipe(
        tap((isLoading) => (this.isLoading = isLoading)),
        takeUntil(this.destroy$)
      )
      .subscribe((isLoading) =>
        isLoading ? this.searchForm.disable() : this.searchForm.enable()
      );

    this.searchForm.valueChanges
      .pipe(
        debounceTime(300),
        skipWhile(() =>
          isEqual(this.searchForm.getRawValue(), this.searchConfig)
        ),
        distinctUntilChanged((prev, current) => isEqual(prev, current)),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        if (!isEqual(this.searchForm.getRawValue(), this.searchConfig)) {
          this.store.dispatch(
            fromArticlesFeature.updateSearchConfig({
              searchConfig: this.searchForm.getRawValue(),
            })
          );
        }
      });
  }

  private mergeArticlesAndAuthors(
    articlesList: Article[],
    authors: User[]
  ): Article[] {
    return articlesList.map((article) => {
      article.author = authors.find((user) => user.id === article.authorId);
      return article;
    });
  }

  private initBreakPointListener(): void {
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        const breakPoints = toPairs(result.breakpoints);
        const matchPoint = !!breakPoints.find((pair) => pair[1])
          ? breakPoints.find((pair) => pair[1])[0]
          : null;

        switch (matchPoint) {
          case Breakpoints.XSmall:
            this.articlesPerRow = 1;
            break;
          case Breakpoints.Small:
            this.articlesPerRow = 2;
            break;
          default:
            this.articlesPerRow = 3;
        }

        if (this.list.length) {
          this.divideArticlesList();
        }
      });
  }

  private divideArticlesList(): void {
    this.chunks = chunk(this.list, this.pageSize).map((arr) =>
      chunk(arr, this.articlesPerRow)
    );
    this.currentPage =
      this.currentPage > this.chunks.length
        ? this.chunks.length - 1
        : this.currentPage;

    this.cdr.detectChanges();
  }

  clearSearchInput(): void {
    this.searchForm.controls['searchKeyword'].setValue('');
  }
}
