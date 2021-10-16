import { createAction, props } from '@ngrx/store';
import {
  NytArticle,
  UserGeolocationCoordinates,
  Weather,
} from '../../widgets.model';
import { HttpErrorResponse } from '@angular/common/http';

export const UPDATE_GEOLOCATION_STATE = 'UPDATE_GEOLOCATION_STATE';
export const updateGeolocationState = createAction(
  UPDATE_GEOLOCATION_STATE,
  props<{ geolocation: UserGeolocationCoordinates }>()
);

export const GET_WEATHER = 'GET_WEATHER';
export const getWeather = createAction(GET_WEATHER);
export const GET_WEATHER_SUCCESS = 'GET_WEATHER_SUCCESS';
export const getWeatherSuccess = createAction(
  GET_WEATHER_SUCCESS,
  props<{ weather: Weather }>()
);
export const GET_WEATHER_FAILURE = 'GET_WEATHER_FAILURE';
export const getWeatherFailure = createAction(
  GET_WEATHER_FAILURE,
  props<{ error: HttpErrorResponse }>()
);

export const GET_NYT_NEWS = 'GET_NYT_NEWS';
export const getNytNews = createAction(GET_NYT_NEWS);
export const GET_NYT_NEWS_SUCCESS = 'GET_NYT_NEWS_SUCCESS';
export const getNytNewsSuccess = createAction(
  GET_NYT_NEWS_SUCCESS,
  props<{ news: NytArticle[] }>()
);
export const GET_NYT_NEWS_FAILURE = 'GET_NYT_NEWS_FAILURE';
export const getNytNewsFailure = createAction(
  GET_NYT_NEWS_FAILURE,
  props<{ error: HttpErrorResponse }>()
);
