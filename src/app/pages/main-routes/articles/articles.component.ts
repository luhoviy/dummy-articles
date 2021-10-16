import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromWidgetsFeature from './widgets/store';
import { ClearObservable } from '../../../shared/components/clear-observable.component';
import { MatSidenav } from '@angular/material/sidenav';
import {
  delay,
  filter,
  map,
  take,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { getIsNetworkOnline } from '../../../store/selectors/app.selectors';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss'],
})
export class ArticlesComponent
  extends ClearObservable
  implements AfterViewInit, OnInit
{
  @ViewChild(MatSidenav) widgets: MatSidenav;
  isWidgetsVisible: boolean = false;
  isDesktop: boolean = true;

  constructor(
    private store: Store,
    private breakpointObserver: BreakpointObserver
  ) {
    super();
  }

  ngOnInit(): void {
    this.breakpointObserver
      .observe('(min-width:1279px)')
      .pipe(
        map((res) => res.matches),
        take(1),
        takeUntil(this.destroy$)
      )
      .subscribe((isDesktop) => (this.isDesktop = isDesktop));
  }

  ngAfterViewInit(): void {
    if (!this.isDesktop) return;
    combineLatest(
      this.store.select(fromWidgetsFeature.getWeatherWidget),
      this.store.select(fromWidgetsFeature.getNytNewsWidget)
    )
      .pipe(
        tap((res) => {
          if (!res[0]) this.store.dispatch(fromWidgetsFeature.getWeather());
          if (!res[1]) this.store.dispatch(fromWidgetsFeature.getNytNews());
        }),
        withLatestFrom(this.store.select(getIsNetworkOnline)),
        filter(([widgets, isNetworkOnline]) =>
          isNetworkOnline
            ? widgets.every((el) => !!el)
            : widgets.some((el) => !!el)
        ),
        delay(300),
        take(1),
        takeUntil(this.destroy$)
      )
      .subscribe(async () => {
        this.isWidgetsVisible = true;
        await this.widgets.open();
      });
  }
}
