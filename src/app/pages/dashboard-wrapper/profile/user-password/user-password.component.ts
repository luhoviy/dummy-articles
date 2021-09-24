import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromAuthFeature from '../../../../authentication/store';
import { ClearObservable } from '../../../../shared/components/clear-observable.component';
import { filter, takeUntil } from 'rxjs/operators';
import { AuthProviderType } from '../../../../authentication/shared/auth.model';
import { NewPasswordFormResponse } from '../../../../shared/components/new-password-form/new-password-form.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { Actions, ofType } from '@ngrx/effects';
import { NotificationsService } from '../../../../shared/services/notifications.service';
import { AuthService } from '../../../../authentication/services/auth.service';
import { ParseFirebaseErrorMessage } from '../../../../shared/utils';

@Component({
  selector: 'app-user-password',
  templateUrl: './user-password.component.html',
  styleUrls: ['./user-password.component.scss'],
})
export class UserPasswordComponent extends ClearObservable implements OnInit {
  hasPasswordProviderType: boolean;
  userEmail: string;

  constructor(
    private store: Store,
    private actions$: Actions,
    private authService: AuthService,
    private notifications: NotificationsService,
    private spinner: NgxSpinnerService
  ) {
    super();
  }

  ngOnInit(): void {
    this.initSubscriptions();
  }

  private initSubscriptions(): void {
    this.store
      .select(fromAuthFeature.getCurrentUser)
      .pipe(
        filter((user) => !!user),
        takeUntil(this.destroy$)
      )
      .subscribe((user) => {
        this.userEmail = user.email;
        this.hasPasswordProviderType = user.providerTypes.includes(
          AuthProviderType.PASSWORD
        );
      });

    this.store
      .select(fromAuthFeature.getIsAuthLoading)
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoading) =>
        isLoading ? this.spinner.show() : this.spinner.hide()
      );

    this.actions$
      .pipe(
        ofType(
          fromAuthFeature.linkAnotherAccountSuccess,
          fromAuthFeature.changeUserPasswordSuccess,
          fromAuthFeature.changeUserPasswordFailure
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((action) => {
        if (action.type === fromAuthFeature.CHANGE_USER_PASSWORD_FAILURE) {
          this.notifications.error(
            action.error.code === 'auth/wrong-password'
              ? 'Please provide a correct current password!'
              : ParseFirebaseErrorMessage(action.error)
          );
          return;
        }

        const isPasswordChange =
          action.type === fromAuthFeature.CHANGE_USER_PASSWORD_SUCCESS;
        this.notifications.success(
          `Password has been successfully ${
            isPasswordChange ? 'changed' : 'set'
          }!`
        );
      });
  }

  public changePassword(passwords: NewPasswordFormResponse): void {
    if (!this.hasPasswordProviderType) {
      const { newPassword } = passwords;
      this.store.dispatch(
        fromAuthFeature.linkAnotherAccount({
          providerType: AuthProviderType.PASSWORD,
          credentials: { email: this.userEmail, password: newPassword },
        })
      );
      return;
    }

    this.store.dispatch(
      fromAuthFeature.changeUserPassword({
        email: this.userEmail,
        passwords,
      })
    );
  }
}
