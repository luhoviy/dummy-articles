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
  hasLocationPermissions$: Observable<boolean> = this.store
    .select(fromWidgetsFeature.getGeolocation)
    .pipe(map((location) => !!location));
  isNetworkOnline$: Observable<boolean> = this.store.select(getIsNetworkOnline);

  weather: Weather;
  currentNytArticle: NytArticle;
  newsIterator: number = 0;
  showNewsWidget: boolean;

  constructor(private store: Store) {
    super();
  }

  ngOnInit(): void {
    this.store
      .select(fromWidgetsFeature.getWeatherWidget)
      .pipe(
        filter((res) => !!res),
        map((res) => {
          res = { ...res };
          res.dt *= 1000;
          return res;
        }),
        takeUntil(this.destroy$)
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
              this.newsIterator >= news.length - 1
                ? (this.newsIterator = 0)
                : this.newsIterator++;
              this.showNewsWidget = false;
              this.currentNytArticle = news[this.newsIterator];
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
