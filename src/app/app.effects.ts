import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { fromEvent, merge } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { updateNetworkState } from './store/actions/network.actions';
import { NotificationsService } from './shared/services/notifications.service';
import * as fromAuthFeature from './authentication/store';
import { isEmpty } from 'lodash';
import { AuthProviderType } from './authentication/shared/auth.model';
import { AuthService } from './authentication/services/auth.service';
import { ParseFirebaseErrorMessage } from './shared/utils';
import { Store } from "@ngrx/store";

@Injectable()
export class AppEffects {
  constructor(
    private notifications: NotificationsService,
    private actions$: Actions,
    private store: Store
  ) {
  }

  observeNetworkState$ = createEffect(() =>
    merge(fromEvent(window, 'online'), fromEvent(window, 'offline')).pipe(
      map((event) => updateNetworkState({isOnline: event.type === 'online'}))
    )
  );

  showFirebaseErrors$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          fromAuthFeature.loginWithEmailFailure,
          fromAuthFeature.loginWithProviderFailure,
          fromAuthFeature.signUpWithEmailFailure,
          fromAuthFeature.linkAnotherAccountFailure,
          fromAuthFeature.unlinkAnotherAccountFailure
        ),
        filter((payload) => !isEmpty(payload.error) && !!payload.error.code),
        tap((payload) => {
          let showAsNotification: boolean = false;
          const alertConfig = {
            text: ParseFirebaseErrorMessage(payload.error),
            duration: 5,
            showButton: false,
            buttonText: 'Dismiss',
          };

          switch (payload.error.code) {
            case 'auth/user-not-found':
            case 'auth/wrong-password':
              alertConfig.text = 'Invalid password or email address.';
              alertConfig.duration = 3;
              const accountProviders: AuthProviderType[] =
                payload['authProviders'];
              if (
                !isEmpty(accountProviders) &&
                !accountProviders.includes(AuthProviderType.PASSWORD)
              ) {
                const providersAsString = (
                  AuthService.transformAuthProviderType(
                    accountProviders
                  ) as string[]
                ).join(' or');
                alertConfig.text = `This account does not have a password, please login using ${providersAsString} authentication provider${accountProviders.length > 1 ? 's' : ''} to set a password.`;
                alertConfig.duration = 0;
                alertConfig.showButton = true;
                alertConfig.buttonText = 'Got It';
                showAsNotification = true;
              }
              break;
            case 'auth/requires-recent-login':
              alertConfig.showButton = true;
              alertConfig.duration = 0;
              showAsNotification = true;
              this.store.dispatch(fromAuthFeature.logout())
              break;
            case 'auth/account-exists-with-different-credential':
              alertConfig.showButton = true;
              alertConfig.duration = 0;
              break;
          }

          if (!!alertConfig.text) {
            const alertProps = Object.values(alertConfig);
            showAsNotification
              // @ts-ignore
              ? this.notifications.notification(...alertProps)
              // @ts-ignore
              : this.notifications.error(...alertProps);
          }
        })
      ),
    {
      dispatch: false,
    }
  );
}
