import { createFeatureSelector, createSelector } from '@ngrx/store';
import { WidgetsState } from '../reducers';

const getWidgetsState = createFeatureSelector<WidgetsState>('widgets');

export const getWeatherWidget = createSelector(getWidgetsState, (state) =>
  state ? state.weather : null
);

export const getGeolocation = createSelector(getWidgetsState, (state) =>
  state ? state.geolocation : null
);

export const getNytNewsWidget = createSelector(getWidgetsState, (state) =>
  state ? state.nytNews : null
);
