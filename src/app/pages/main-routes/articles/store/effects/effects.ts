import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of, Subject } from 'rxjs';
import * as fromFeature from '../../store';
import {
  delay,
  distinctUntilChanged,
  map,
  mergeMap,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { ArticlesService } from '../../shared/articles.service';
import { isEqual } from 'lodash';
import { getIsNetworkOnline } from '../../../../../store/selectors/app.selectors';
import { getCurrentUser } from '../../../../../authentication/store';
import {
  getDataFromLocaleStorage,
  saveDataToLocaleStorage,
} from '../../../../../shared/utils';
import { SearchConfig } from '../../shared/models';

@Injectable()
export class ArticlesEffects {
  unsubscribe$ = new Subject<void>();

  constructor(
    private actions$: Actions,
    private store: Store,
    private articlesService: ArticlesService
  ) {}

  getArticles$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromFeature.getArticles, fromFeature.updateSearchConfig),
        withLatestFrom(
          this.store.select(fromFeature.getSearchConfig),
          this.store.select(getIsNetworkOnline)
        ),
        tap(([_, searchConfig, isOnline]) => {
          this.destroySubscription();
          this.articlesService
            .getArticleIdsBySearchKeyword()
            .pipe(
              mergeMap((ids) =>
                !!searchConfig.searchKeyword && !ids.length
                  ? of([])
                  : this.articlesService.getArticlesList(ids)
              ),
              delay(isOnline ? 500 : 0),
              distinctUntilChanged((prev, current) => isEqual(prev, current)),
              takeUntil(this.unsubscribe$)
            )
            .subscribe((list) => {
              this.store.dispatch(fromFeature.getArticlesSuccess({ list }));
            });
        })
      ),
    { dispatch: false }
  );

  setLoadingState$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        fromFeature.GET_ARTICLES,
        fromFeature.UPDATE_SEARCH_CONFIG,
        fromFeature.GET_ARTICLES_SUCCESS,
        fromFeature.GET_ARTICLES_FAILURE
      ),
      map(({ type }) =>
        fromFeature.setLoadingState({
          isLoading:
            type === fromFeature.GET_ARTICLES ||
            type === fromFeature.UPDATE_SEARCH_CONFIG,
        })
      )
    )
  );

  clearStore$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromFeature.CLEAR_ARTICLES_STORE),
        tap(() => this.destroySubscription())
      ),
    { dispatch: false }
  );

  saveSearchConfig = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromFeature.updateSearchConfig),
        withLatestFrom(this.store.select(getCurrentUser)),
        tap(([{ searchConfig }, currentUser]) => {
          const savedConfigs: { [userId: string]: SearchConfig } =
            getDataFromLocaleStorage('searchConfigs') || {};
          savedConfigs[currentUser.id] = searchConfig;
          saveDataToLocaleStorage('searchConfigs', savedConfigs);
        })
      ),
    { dispatch: false }
  );

  private destroySubscription() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.unsubscribe$ = new Subject();
  }
}
