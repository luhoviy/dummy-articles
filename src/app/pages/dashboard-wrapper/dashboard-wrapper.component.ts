import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromAuthFeature from '../../authentication/store';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ClearObservable } from '../../shared/components/clear-observable.component';
import { map, takeUntil } from 'rxjs/operators';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-dashboard-wrapper',
  templateUrl: './dashboard-wrapper.component.html',
  styleUrls: ['./dashboard-wrapper.component.scss'],
})
export class DashboardWrapperComponent
  extends ClearObservable
  implements OnInit
{
  @ViewChild('sideNav', { static: false }) sideNav: MatSidenav;
  currentUser$ = this.store.select(fromAuthFeature.getCurrentUser);
  isDesktop: boolean = true;

  constructor(
    private store: Store,
    private breakpointObserver: BreakpointObserver
  ) {
    super();
  }

  ngOnInit(): void {
    this.breakpointObserver
      .observe('(min-width:1024px)')
      .pipe(
        map((res) => res.matches),
        takeUntil(this.destroy$)
      )
      .subscribe((isDesktop) => (this.isDesktop = isDesktop));
  }

  public logout(): void {
    this.store.dispatch(fromAuthFeature.logout());
  }
}
