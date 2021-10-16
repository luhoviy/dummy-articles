import { createAction, props } from '@ngrx/store';
import { Article, SearchConfig } from '../../shared/models';
import firebase from 'firebase/compat/app';
import { User } from '../../../../../authentication/shared/auth.model';

export const GET_ARTICLES = 'GET_ARTICLES';
export const GET_ARTICLES_SUCCESS = 'GET_ARTICLES_SUCCESS';
export const GET_ARTICLES_FAILURE = 'GET_ARTICLES_FAILURE';

export const getArticles = createAction(GET_ARTICLES);
export const getArticlesSuccess = createAction(
  GET_ARTICLES_SUCCESS,
  props<{ list: Article[] }>()
);
export const getArticlesFailure = createAction(
  GET_ARTICLES_FAILURE,
  props<{ error: firebase.FirebaseError }>()
);

export const UPDATE_ARTICLE_AUTHORS = 'UPDATE_ARTICLE_AUTHORS';
export const updateArticleAuthors = createAction(
  UPDATE_ARTICLE_AUTHORS,
  props<{ articleAuthors: User[] }>()
);

export const UPDATE_SEARCH_CONFIG = 'UPDATE_SEARCH_CONFIG';
export const updateSearchConfig = createAction(
  UPDATE_SEARCH_CONFIG,
  props<{ searchConfig: SearchConfig }>()
);

export const SET_LOADING_STATE = 'SET_LOADING_STATE';
export const setLoadingState = createAction(
  SET_LOADING_STATE,
  props<{ isLoading: boolean }>()
);

export const CLEAR_ARTICLES_STORE = 'CLEAR_ARTICLES_STORE';
export const clearArticlesStore = createAction(CLEAR_ARTICLES_STORE);
