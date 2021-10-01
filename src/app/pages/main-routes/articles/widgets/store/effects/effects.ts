import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as fromWidgetsFeature from '../index';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { WidgetsService } from '../../widgets.service';
import { of } from 'rxjs';
import { orderBy } from 'lodash';

@Injectable()
export class Effects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private widgetsService: WidgetsService
  ) {}

  getWeather$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromWidgetsFeature.getWeather),
      switchMap(() =>
        this.widgetsService.getGeolocationCoordinates().pipe(
          switchMap((coordinates) => {
            return this.widgetsService.getWeather(coordinates).pipe(
              map((weather) =>
                fromWidgetsFeature.getWeatherSuccess({ weather })
              ),
              catchError((error) =>
                of(fromWidgetsFeature.getWeatherFailure({ error }))
              )
            );
          })
        )
      )
    )
  );

  getNews$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromWidgetsFeature.getNytNews),
      switchMap(() =>
        this.widgetsService.getNytNews().pipe(
          map((news) =>
            news.results.map((result) => {
              result.multimedia = orderBy(result.multimedia, 'width', 'desc');
              return result;
            })
          ),
          map((news) => fromWidgetsFeature.getNytNewsSuccess({ news })),
          catchError((error) =>
            of(fromWidgetsFeature.getNytNewsFailure({ error }))
          )
        )
      )
    )
  );
}
