import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, switchMap, take, tap } from 'rxjs/operators';
import * as fromAuthFeature from '../authentication/store';

@Injectable()
export class AuthCanLoadGuard implements CanLoad {
  constructor(private store: Store, private router: Router) {}

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.store.select(fromAuthFeature.getIsInitialAuthState).pipe(
      filter((isInitialAuthState) => !isInitialAuthState),
      switchMap(() => this.store.select(fromAuthFeature.getIsLoggedIn)),
      tap((isLoggedIn) =>
        !isLoggedIn ? this.router.navigate(['login']) : null
      ),
      take(1)
    );
  }
}
