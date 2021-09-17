import { Action, createReducer, on } from '@ngrx/store';
import { User } from '../../shared/auth.model';
import * as fromAuthFeature from '../index';

export interface AuthState {
  user: User;
  isLoading: boolean;
  initialAuthState: boolean;
}

export const initialState: AuthState = {
  user: null,
  isLoading: false,
  initialAuthState: true,
};

export const reducer = createReducer(
  initialState,
  on(fromAuthFeature.updateAuthState, (state, {user}) => {
    return {
      ...state,
      user,
      initialAuthState: false,
    };
  }),
  on(fromAuthFeature.updateCurrentUser, (state, {user}) => {
    return {
      ...state,
      user
    };
  }),
  on(fromAuthFeature.updateAuthLoading, (state, {isLoading}) => {
    return {
      ...state,
      isLoading,
    };
  })
);

export function authReducerFactory(
  state: AuthState | undefined,
  action: Action
) {
  return reducer(state, action);
}
