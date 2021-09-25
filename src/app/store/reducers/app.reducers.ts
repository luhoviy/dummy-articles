import { ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store';
import { storeLogger } from 'ngrx-store-logger';
import { environment } from '../../../environments/environment';
import { authReducerFactory, AuthState } from '../../authentication/store';
import { networkReducerFactory, NetworkState } from './network.reducer';

export interface AppState {
  networkState: NetworkState;
  authentication: AuthState;
}

export const reducers: ActionReducerMap<AppState> = {
  networkState: networkReducerFactory,
  authentication: authReducerFactory,
};

const logger = (reducer: ActionReducer<AppState>): ActionReducer<AppState> =>
  storeLogger()(reducer);
export const metaReducers: MetaReducer<AppState>[] = environment.production
  ? []
  : [logger];
