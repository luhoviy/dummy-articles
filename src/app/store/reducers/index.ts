import { ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store';
import { networkReducerFactory, NetworkState } from './network.reducer';
import { environment } from '../../../environments/environment';
import { storeLogger } from 'ngrx-store-logger';

export interface AppState {
  network: NetworkState;
}

export const reducers: ActionReducerMap<AppState> = {
  network: networkReducerFactory,
};

export function logger(
  reducer: ActionReducer<AppState>
): ActionReducer<AppState> {
  return storeLogger()(reducer);
}

export const metaReducers: MetaReducer<AppState>[] = environment.production
  ? []
  : [logger];
