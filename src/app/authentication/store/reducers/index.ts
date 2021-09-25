import { Action, createReducer, on } from '@ngrx/store';
import { User } from '../../shared/auth.model';
import * as AuthActions from '../actions';

export interface AuthState {
  user: User;
  initialAuthState: boolean;
}

export const initialState: AuthState = {
  user: null,
  initialAuthState: true,
};

const reducer = createReducer(
  initialState,
  on(AuthActions.updateAuthState, (state, { user }) => {
    return {
      ...state,
      user,
      initialAuthState: false,
    };
  }),
  on(AuthActions.updateCurrentUser, (state, { user }) => {
    return {
      ...state,
      user,
    };
  })
);

export const authReducerFactory = (
  state: AuthState | undefined,
  action: Action
) => reducer(state, action);
