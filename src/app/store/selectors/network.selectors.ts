import { createFeatureSelector, createSelector } from "@ngrx/store";
import { NetworkState } from "../reducers/network.reducer";

export const getNetworkState = createFeatureSelector<NetworkState>("network");
export const getNetworkOnlineState = createSelector(getNetworkState, (state) => state.isOnline)
