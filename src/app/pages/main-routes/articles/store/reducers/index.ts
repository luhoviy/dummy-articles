import { Action, createReducer, on } from '@ngrx/store';
import { Article, SearchConfig } from '../../shared/models';
import { InitialSearchConfig } from '../../shared/constants';
import * as ArticlesActions from '../actions';
import { User } from '../../../../../authentication/shared/auth.model';

export interface ArticlesState {
  list: Article[];
  articleAuthors: User[];
  searchConfig: SearchConfig;
  isLoading: boolean;
}

export const initialState: ArticlesState = {
  list: null,
  articleAuthors: [],
  searchConfig: InitialSearchConfig,
  isLoading: false,
};

const reducer = createReducer(
  initialState,
  on(ArticlesActions.getArticlesSuccess, (state, { list }) => {
    return {
      ...state,
      list,
    };
  }),
  on(ArticlesActions.updateArticleAuthors, (state, { articleAuthors }) => {
    return {
      ...state,
      articleAuthors,
    };
  }),
  on(ArticlesActions.updateSearchConfig, (state, { searchConfig }) => {
    return {
      ...state,
      searchConfig,
    };
  }),
  on(ArticlesActions.setLoadingState, (state, { isLoading }) => {
    return {
      ...state,
      isLoading,
    };
  }),
  on(ArticlesActions.clearArticlesStore, () => {
    return {
      ...initialState,
    };
  })
);

export const ArticlesReducerFactory = (
  state: ArticlesState | undefined,
  action: Action
) => reducer(state, action);
