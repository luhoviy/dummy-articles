import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromWidgetsFeature from './store';
import { delay, filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ClearObservable } from '../../../../shared/components/clear-observable.component';
import { NytArticle, Weather } from './widgets.model';
import { Observable, timer } from 'rxjs';
import { shuffle } from 'lodash';
import { getIsNetworkOnline } from '../../../../store/selectors/app.selectors';
import { fadeIn } from '../../../../shared/animations';

@Component({
  selector: 'app-widgets',
  templateUrl: './widgets.component.html',
  styleUrls: ['./widgets.component.scss'],
  animations: [fadeIn],
})
export class WidgetsComponent extends ClearObservable implements OnInit {
  weather: Weather;
  currentNytArticle: NytArticle;
  iterator: number = 0;
  hasLocationPermissions$: Observable<boolean> = this.store
    .select(fromWidgetsFeature.getGeolocation)
    .pipe(map((location) => !!location));
  isNetworkOnline$: Observable<boolean> = this.store.select(getIsNetworkOnline);
  showNewsWidget: boolean = false;

  constructor(private store: Store) {
    super();
  }

  ngOnInit(): void {
    this.store
      .select(fromWidgetsFeature.getWeatherWidget)
      .pipe(
        takeUntil(this.destroy$),
        filter((res) => !!res),
        map((res) => {
          res = { ...res };
          res.dt *= 1000;
          return res;
        })
      )
      .subscribe((res) => {
        this.weather = res;
      });

    this.store
      .select(fromWidgetsFeature.getNytNewsWidget)
      .pipe(
        filter((news) => !!news),
        map((news) => shuffle(news)),
        switchMap((news) =>
          timer(0, 15 * 1000).pipe(
            tap(() => {
              this.iterator > news.length - 1
                ? (this.iterator = 0)
                : this.iterator++;
              this.showNewsWidget = false;
              this.currentNytArticle = news[this.iterator];
            }),
            delay(100)
          )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.showNewsWidget = true;
      });
  }
}
