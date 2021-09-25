import { Action, createReducer, on } from '@ngrx/store';
import { updateNetworkState } from '../actions/app.actions';

export interface NetworkState {
  isOnline: boolean;
}

export const initialState: NetworkState = {
  isOnline: navigator.onLine,
};

const reducer = createReducer(
  initialState,
  on(updateNetworkState, (state, { isOnline }) => {
    return {
      isOnline,
    };
  })
);

export const networkReducerFactory = (
  state: NetworkState | undefined,
  action: Action
) => reducer(state, action);
