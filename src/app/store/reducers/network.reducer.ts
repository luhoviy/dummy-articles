import { Action, createReducer, on } from '@ngrx/store';
import { updateNetworkState } from "../actions/network.actions";


export interface NetworkState {
  isOnline: boolean;
}

export const initialState: NetworkState = {
  isOnline: navigator.onLine
};

export const reducer = createReducer(
  initialState,
  on(updateNetworkState, (state,  { isOnline }) => {
    return {
      ...state,
      isOnline
    }
  })
);

export function networkReducerFactory(state: NetworkState | undefined, action: Action) {
  return reducer(state, action);
}

