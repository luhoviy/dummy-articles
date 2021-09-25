import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  AngularFireAuth,
  AngularFireAuthModule,
  PERSISTENCE,
  USE_DEVICE_LANGUAGE,
} from '@angular/fire/compat/auth';
import { Store } from '@ngrx/store';
import { filter, map, withLatestFrom } from 'rxjs/operators';
import { User } from './shared/auth.model';
import * as fromAuthStore from './store';
import { getIsNetworkOnline } from '../store/selectors/app.selectors';
import { AuthService } from './services/auth.service';

@NgModule({
  declarations: [],
  imports: [CommonModule, AngularFireAuthModule],
  providers: [
    { provide: USE_DEVICE_LANGUAGE, useValue: true },
    { provide: PERSISTENCE, useValue: 'local' },
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
          this.store.select(getIsNetworkOnline)
        ),
        filter(
          ([currentUser, prevUser, isInitialState]) =>
            isInitialState || !!currentUser !== !!prevUser
        ),
        map(([currentUser, _, isInitialState, isOnline]) => {
          const user = !!currentUser ? new User(currentUser) : null;
          if (!!user && isInitialState && isOnline) {
            this.authService.mergeAndSaveUser(user, true);
          }
          return user;
        })
      )
      .subscribe((user) =>
        this.store.dispatch(fromAuthStore.updateAuthState({ user }))
      );
  }
}
