import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import * as fromAuthFeature from '../authentication/store';

@Injectable()
export class NoAuthCanLoadGuard implements CanLoad {
  constructor(private store: Store, private router: Router) {}

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> {
    return this.store.select(fromAuthFeature.getIsInitialAuthState).pipe(
      filter((isInitialAuthState) => !isInitialAuthState),
      switchMap(() => this.store.select(fromAuthFeature.getIsLoggedIn)),
      map((isLoggedIn) => !isLoggedIn),
      tap((isLoggedOut) =>
        isLoggedOut ? null : this.router.navigate(['display/articles'])
      ),
      take(1)
    );
  }
}
