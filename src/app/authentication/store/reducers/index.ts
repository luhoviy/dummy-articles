import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import { authReducerFactory, AuthState } from './auth.reducer';

export interface State {
  auth: AuthState;
}

export const reducers: ActionReducerMap<State> = {
  auth: authReducerFactory,
};

export const getAuthenticationState =
  createFeatureSelector<State>('authentication');