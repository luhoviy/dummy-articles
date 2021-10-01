import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { NytNews, UserGeolocationCoordinates, Weather } from './widgets.model';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromWidgetsFeature from './store';
import {
  catchError,
  switchMap,
  take,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';
import { getIsNetworkOnline } from '../../../../store/selectors/app.selectors';

@Injectable()
export class WidgetsService {
  constructor(private http: HttpClient, private store: Store) {}

  private static askGeolocationCoordinates(): Promise<GeolocationCoordinates> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (res) => resolve(res.coords),
        (err) => reject(err)
      );
    });
  }

  public getGeolocationCoordinates(): Observable<UserGeolocationCoordinates> {
    return this.store.select(fromWidgetsFeature.getGeolocation).pipe(
      take(1),
      withLatestFrom(this.store.select(getIsNetworkOnline)),
      switchMap(([geolocation, isOnline]) => {
        if (!isOnline) {
          return of(null);
        }

        if (!!geolocation) {
          return of(geolocation);
        }

        return fromPromise(WidgetsService.askGeolocationCoordinates()).pipe(
          tap((coordinates) =>
            this.store.dispatch(
              fromWidgetsFeature.updateGeolocationState({
                geolocation: {
                  latitude: coordinates.latitude,
                  longitude: coordinates.longitude,
                },
              })
            )
          ),
          catchError(() => of(null))
        );
      })
    );
  }

  public getWeather(
    coordinates: UserGeolocationCoordinates
  ): Observable<Weather> {
    let params = new HttpParams()
      .set('appid', environment.OPEN_WEATHER_API.apiKey)
      .set('units', 'metric');
    params = !!coordinates
      ? params
          .set('lat', coordinates.latitude)
          .set('lon', coordinates.longitude)
      : params.set('q', 'Los Angeles');

    return this.http.get<Weather>(environment.OPEN_WEATHER_API.apiUrl, {
      params,
    });
  }

  public getNytNews(): Observable<NytNews> {
    const params = new HttpParams().set('api-key', environment.NYT_API.apiKey);
    return this.http.get<NytNews>(environment.NYT_API.apiUrl, { params });
  }
}
