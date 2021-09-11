import { createAction, props } from '@ngrx/store';

export const UPDATE_NETWORK_STATE = "UPDATE_NETWORK_STATE";

export const updateNetworkState = createAction(
    UPDATE_NETWORK_STATE,
    props<{ isOnline: boolean }>()
);




