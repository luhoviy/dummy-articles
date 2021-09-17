import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, skip, skipWhile, tap, withLatestFrom, } from 'rxjs/operators';
import * as fromAuthFeature from '../index';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User, UserAdditionalInfo } from '../../shared/auth.model';
import firebase from 'firebase/compat/app';
import { Store } from "@ngrx/store";
import { mergeUserWithDbUserRecord } from "../../../shared/utils";

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private router: Router,
    private authService: AuthService,
    private store: Store
  ) {
  }

  saveUserToDb$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromAuthFeature.saveUserToDb),
      tap(({user}) => this.authService.updateUserInFirebaseAuthStore(user)),
      mergeMap(({user}) =>
        this.authService.saveUserDataToDb(user).pipe(
          map(() => fromAuthFeature.saveUserToDbSuccess({user})),
          catchError((error) =>
            of(fromAuthFeature.saveUserToDbFailure({error}))
          )
        )
      )
    )
  );

  loginWithEmail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromAuthFeature.loginWithEmail),
      mergeMap(({email, password}) =>
        this.authService.loginWithEmail(email, password).pipe(
          tap(response => this.authService.mergeAndSaveUser(new User(response.user))),
          map(() => fromAuthFeature.loginWithEmailSuccess()),
          catchError((error: firebase.FirebaseError) => {
            if (error.code === 'auth/wrong-password') {
              return this.authService.getAccountProviders(email).pipe(
                map((authProviders) =>
                  fromAuthFeature.loginWithEmailFailure({
                    error,
                    authProviders,
                  })
                ),
                catchError(() => of(fromAuthFeature.loginWithEmailFailure({error})))
              );
            }
            return of(fromAuthFeature.loginWithEmailFailure({error}));
          })
        )
      )
    )
  );

  signUpWithEmail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromAuthFeature.signUpWithEmail),
      mergeMap(payload =>
        this.authService.signUp(payload.credentials.email, payload.credentials.password).pipe(
          tap(response => this.store.dispatch(fromAuthFeature.saveUserToDb({user: new User(response.user, payload.info)}))),
          map(() => fromAuthFeature.signUpWithEmailSuccess()),
          catchError((error) =>
            of(fromAuthFeature.signUpWithEmailFailure({error}))
          )
        )
      )
    )
  );

  loginWithProvider$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromAuthFeature.loginWithProvider),
      mergeMap(({providerType}) =>
        this.authService.loginWithProvider(providerType).pipe(
          tap(response => {
            const additionalInfo = response['_tokenResponse'] as UserAdditionalInfo;
            if (additionalInfo && additionalInfo.isNewUser) {
              this.store.dispatch(fromAuthFeature.saveUserToDb({user: new User(response.user, additionalInfo)}));
              return
            }
            this.authService.mergeAndSaveUser(new User(response.user));
          }),
          map(() => fromAuthFeature.loginWithProviderSuccess()),
          catchError((error) => of(fromAuthFeature.loginWithProviderFailure({error})))
        )
      )
    )
  );

  linkAnotherAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromAuthFeature.linkAnotherAccount),
      mergeMap((payload) =>
        this.authService.linkAnotherAccount(
          payload.providerType,
          payload.credentials
        ).pipe(
          withLatestFrom(this.store.select(fromAuthFeature.getCurrentUser)),
          map(([res, currentUser]) => {
            const user = mergeUserWithDbUserRecord(new User(res.user), {...currentUser});
            return fromAuthFeature.linkAnotherAccountSuccess({user});
          }),
          catchError((error) => of(fromAuthFeature.linkAnotherAccountFailure({error})))
        )
      )
    )
  );

  unlinkAnotherAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromAuthFeature.unlinkAnotherAccount),
      mergeMap((payload) =>
        this.authService.unlinkAnotherAccount(payload.providerType).pipe(
          withLatestFrom(this.store.select(fromAuthFeature.getCurrentUser)),
          map(([newUser, currentUser]) => {
            const user = mergeUserWithDbUserRecord(new User(newUser), {...currentUser});
            return fromAuthFeature.linkAnotherAccountSuccess({user});
          }),
          catchError((error) => of(fromAuthFeature.unlinkAnotherAccountFailure({error})))
        )
      )
    )
  );

  updateCurrentUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        fromAuthFeature.saveUserToDbSuccess,
        fromAuthFeature.linkAnotherAccountSuccess,
        fromAuthFeature.unlinkAnotherAccountSuccess
      ),
      map(({user}) => fromAuthFeature.updateCurrentUser({user}))
    )
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromAuthFeature.LOGOUT),
        mergeMap(() => this.authService.logout())
      ),
    {dispatch: false}
  );

  // ------------------------------------------

  redirectOnAuthStateChange$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromAuthFeature.updateAuthState),
        skip(1),
        skipWhile(() => this.router.url === '/password-recovery'),
        map(({user}) => !!user),
        tap((isLoggedIn) => {
          this.router.navigate(isLoggedIn ? ['display/dashboard'] : ['login']);
        })
      ),
    {dispatch: false}
  );

  startAuthLoading$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        fromAuthFeature.LOGIN_WITH_EMAIL,
        fromAuthFeature.SIGNUP_WITH_EMAIL,
        fromAuthFeature.LOGIN_WITH_PROVIDER,
        fromAuthFeature.LINK_ANOTHER_ACCOUNT,
        fromAuthFeature.UNLINK_ANOTHER_ACCOUNT,
      ),
      map((_) => fromAuthFeature.updateAuthLoading({isLoading: true}))
    )
  );

  stopAuthLoading$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        fromAuthFeature.LOGIN_WITH_EMAIL_SUCCESS,
        fromAuthFeature.LOGIN_WITH_EMAIL_FAILURE,
        fromAuthFeature.SIGNUP_WITH_EMAIL_SUCCESS,
        fromAuthFeature.SIGNUP_WITH_EMAIL_FAILURE,
        fromAuthFeature.LOGIN_WITH_PROVIDER_SUCCESS,
        fromAuthFeature.LOGIN_WITH_PROVIDER_FAILURE,
        fromAuthFeature.LINK_ANOTHER_ACCOUNT_SUCCESS,
        fromAuthFeature.LINK_ANOTHER_ACCOUNT_FAILURE,
        fromAuthFeature.UNLINK_ANOTHER_ACCOUNT_SUCCESS,
        fromAuthFeature.UNLINK_ANOTHER_ACCOUNT_FAILURE
      ),
      map((_) => fromAuthFeature.updateAuthLoading({isLoading: false}))
    )
  );
}
