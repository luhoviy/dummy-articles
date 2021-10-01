import { Action, createReducer, on } from '@ngrx/store';
import {
  NytArticle,
  UserGeolocationCoordinates,
  Weather,
} from '../../widgets.model';
import * as WidgetsActions from '../actions';

export interface WidgetsState {
  weather: Weather;
  geolocation: UserGeolocationCoordinates;
  nytNews: NytArticle[];
}

export const initialState: WidgetsState = {
  weather: null,
  geolocation: null,
  nytNews: null,
};

const reducer = createReducer(
  initialState,
  on(WidgetsActions.updateGeolocationState, (state, { geolocation }) => {
    return {
      ...state,
      geolocation,
    };
  }),
  on(WidgetsActions.getWeatherSuccess, (state, { weather }) => {
    return {
      ...state,
      weather,
    };
  }),
  on(WidgetsActions.getNytNewsSuccess, (state, { news }) => {
    return {
      ...state,
      nytNews: news,
    };
  })
);

export const widgetsReducerFactory = (
  state: WidgetsState | undefined,
  action: Action
) => reducer(state, action);
