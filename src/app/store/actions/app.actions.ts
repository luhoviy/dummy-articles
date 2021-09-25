import { createAction, props } from '@ngrx/store';

export const UPDATE_NETWORK_STATE = 'UPDATE_NETWORK_STATE';
export const updateNetworkState = createAction(
  UPDATE_NETWORK_STATE,
  props<{ isOnline: boolean }>()
);

export const UPDATE_LOADING_STATE = 'UPDATE_LOADING_STATE';
export const updateLoadingState = createAction(
  UPDATE_LOADING_STATE,
  props<{ isLoading: boolean }>()
);
