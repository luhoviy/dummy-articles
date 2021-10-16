import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ArticlesState } from '../reducers';

const getArticlesState = createFeatureSelector<ArticlesState>('articles');

export const getArticlesList = createSelector(getArticlesState, (state) =>
  state ? state.list : null
);

export const getSearchConfig = createSelector(getArticlesState, (state) =>
  state ? state.searchConfig : null
);

export const getArticleAuthors = createSelector(getArticlesState, (state) =>
  state ? state.articleAuthors : null
);

export const getIsLoading = createSelector(getArticlesState, (state) =>
  state ? state.isLoading : null
);
