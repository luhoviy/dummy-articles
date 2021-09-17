import { createSelector } from '@ngrx/store';
import * as fromFeature from '../reducers';

export const getCurrentUser = createSelector(
  fromFeature.getAuthenticationState,
  (state) => (state ? state.auth.user : null)
);

export const getIsLoggedIn = createSelector(getCurrentUser, (user) => !!user);

export const getIsInitialAuthState = createSelector(
  fromFeature.getAuthenticationState,
  (state) => (state ? state.auth.initialAuthState : true)
);

export const getIsAuthLoading = createSelector(
  fromFeature.getAuthenticationState,
  (state) => (state ? state.auth.isLoading : false)
);
