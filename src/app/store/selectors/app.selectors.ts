import { createFeatureSelector, createSelector } from '@ngrx/store';
import { NetworkState } from '../reducers/network.reducer';

export const getNetworkState =
  createFeatureSelector<NetworkState>('networkState');
export const getIsNetworkOnline = createSelector(getNetworkState, (state) =>
  !!state ? state.isOnline : null
);
