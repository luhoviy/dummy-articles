import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from '../reducers';

const getAuthenticationState =
  createFeatureSelector<AuthState>('authentication');

export const getCurrentUser = createSelector(getAuthenticationState, (state) =>
  state ? state.user : null
);

export const getIsLoggedIn = createSelector(getCurrentUser, (user) => !!user);

export const getIsInitialAuthState = createSelector(
  getAuthenticationState,
  (state) => (state ? state.initialAuthState : true)
);
