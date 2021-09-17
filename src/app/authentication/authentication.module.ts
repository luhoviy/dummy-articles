import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularFireAuth, AngularFireAuthModule, PERSISTENCE, USE_DEVICE_LANGUAGE } from '@angular/fire/compat/auth';
import { EffectsModule } from '@ngrx/effects';
import { Store, StoreModule } from '@ngrx/store';
import { filter, map, withLatestFrom } from 'rxjs/operators';
import { User } from './shared/auth.model';
import * as fromAuthStore from './store';
import { AuthEffects } from './store/effects/effects';
import { getNetworkOnlineState } from "../store/selectors/network.selectors";
import { AuthService } from "./services/auth.service";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AngularFireAuthModule,
    StoreModule.forFeature('authentication', fromAuthStore.reducers),
    EffectsModule.forFeature([AuthEffects]),
  ],
  providers: [
    {provide: USE_DEVICE_LANGUAGE, useValue: true},
    {provide: PERSISTENCE, useValue: 'local'},
  ],
})
export class AuthenticationModule {
  constructor(
    private fireAuth: AngularFireAuth,
    private authService: AuthService,
    private store: Store
  ) {
    this.fireAuth.authState
      .pipe(
        withLatestFrom(
          this.store.select(fromAuthStore.getCurrentUser),
          this.store.select(fromAuthStore.getIsInitialAuthState),
          this.store.select(getNetworkOnlineState)
        ),
        filter(
          ([currentUser, prevUser, isInitialState]) =>
            isInitialState || !!currentUser !== !!prevUser
        ),
        map(([currentUser, _, isInitialState, isOnline]) => {
          const user = !!currentUser ? new User(currentUser) : null;
          if (!!user && isInitialState && isOnline) {
            this.authService.mergeAndSaveUser(user);
          }
          return user;
        })
      )
      .subscribe((user) => this.store.dispatch(fromAuthStore.updateAuthState({user})));
  }
}
