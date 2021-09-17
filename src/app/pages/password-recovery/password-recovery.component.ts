import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import firebase from 'firebase/compat';
import { isEmpty } from 'lodash';
import { Observable, timer } from 'rxjs';
import { filter, finalize, map, scan, take, takeUntil, takeWhile, tap, withLatestFrom } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../authentication/services/auth.service';
import { AuthProviderType, User } from '../../authentication/shared/auth.model';
import * as fromAuthFeature from '../../authentication/store';
import { ClearObservable } from '../../shared/components/clear-observable.component';
import { NotificationsService } from '../../shared/services/notifications.service';
import { getNetworkOnlineState } from '../../store/selectors/network.selectors';
import { matchPasswordsValidator } from "../../shared/utils";
import { ConfirmationDialogService } from "../../shared/components/confirmation-dialog/confirmation-dialog.service";
import { ConfirmDialogData } from "../../shared/components/confirmation-dialog/confirmation-dialog.model";

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.scss'],
})
export class PasswordRecoveryComponent
  extends ClearObservable
  implements OnInit {
  isNetworkOnline$: Observable<boolean> = this.store.select(
    getNetworkOnlineState
  );
  emailControl: FormControl;
  passwordsForm: FormGroup;

  isLoading: boolean = false;
  accessToken: string = null;
  targetEmailAddress: string;
  resetEmailSuccessfullySent: boolean = false;
  countDown: string;
  passwordChanged: boolean = false;

  constructor(
    private authService: AuthService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private store: Store,
    private notifications: NotificationsService,
    private confirmDialog: ConfirmationDialogService
  ) {
    super();

    this.activeRoute.queryParams
      .pipe(
        filter((params) => !isEmpty(params)),
        tap(() =>
          this.router.navigate([], {
            relativeTo: this.activeRoute,
            queryParams: {},
          })
        ),
        take(1),
        takeUntil(this.destroy$)
      )
      .subscribe((params) => {
        const {mode, apiKey, oobCode, email} = params;
        if (
          mode === 'resetPassword' &&
          apiKey === environment.firebaseConfig.apiKey &&
          email
        ) {
          this.accessToken = oobCode;
          this.targetEmailAddress = email;
        }
      });
  }

  ngOnInit() {
    this.initControls();
  }

  private initControls(): void {
    this.emailControl = new FormControl('', [
      Validators.required,
      Validators.email,
    ]);
    if (this.targetEmailAddress) {
      this.emailControl.setValue(this.targetEmailAddress);
      this.emailControl.markAsDirty();
    }

    if (this.accessToken) {
      this.passwordsForm = this.fb.group(
        {
          password: ['', [Validators.minLength(6), Validators.required]],
          passwordConfirmation: [
            '',
            [Validators.minLength(6), Validators.required],
          ],
        },
        {
          validators: matchPasswordsValidator(
            'password',
            'passwordConfirmation'
          ),
        }
      );
    }
  }

  async sendResetPasswordEmail(startCountDown: boolean = false): Promise<void> {
    this.isLoading = true;

    this.authService
      .sendPasswordResetEmail(this.emailControl.value)
      .pipe(
        finalize(() => (this.isLoading = false)),
        take(1),
        takeUntil(this.destroy$)
      )
      .subscribe(
        () => {
          this.resetEmailSuccessfullySent = true;
          if (startCountDown) {
            this.startCountDown();
          }
        },
        (err) => this.handleError(err)
      );
  }

  async resetPassword(): Promise<void> {
    this.isLoading = true;

    if (this.targetEmailAddress) {
      try {
        const associatedProviders = await this.authService.getAccountProviders(this.targetEmailAddress).toPromise();
        if (associatedProviders.filter(type => type !== AuthProviderType.PASSWORD).length) {
          const config = new ConfirmDialogData();
          config.description = 'All accounts connected using other authentication providers will be automatically removed from your account.'
          config.confirmButtonText = 'Yes, I understand';
          const confirmed = await this.confirmDialog.open(config).toPromise();
          if (!confirmed) {
            this.isLoading = false;
            return;
          }
        }
      } catch (error) {
        console.log("password change confirmation error", error);
      }
    }

    const {password} = this.passwordsForm.value;
    this.authService
      .resetPassword(this.accessToken, password)
      .pipe(
        withLatestFrom(this.store.select(fromAuthFeature.getCurrentUser)),
        map(([_, currentUser]) => currentUser),
        finalize(() => (this.isLoading = false)),
        take(1),
        takeUntil(this.destroy$)
      )
      .subscribe(
        (user) => this.handleResetPasswordSuccess(user),
        (err) => this.handleError(err)
      );
  }

  private handleError(error: firebase.FirebaseError): void {
    switch (error.code) {
      case 'auth/invalid-action-code':
      case 'auth/expired-action-code':
        this.notifications.error(
          'Your reset token is expired or invalid!',
          0,
          true
        );
        this.accessToken = null;
        break;
      case 'auth/user-not-found':
        this.notifications.error(
          `No accounts found with ${this.emailControl.value} email address.`
        );
        break;
      default:
        this.notifications.error(
          error.message
            ? error.message
            : 'Something went wrong, please try again later.'
        );
        break;
    }
  }

  private handleResetPasswordSuccess(user: User) {
    this.passwordChanged = true;
    if (user && user.email === this.targetEmailAddress) {
      this.store.dispatch(fromAuthFeature.logout());
    }
  }

  useAnotherEmail(): void {
    this.emailControl.setValue('');
    this.emailControl.markAsUntouched();
    this.resetEmailSuccessfullySent = false;
  }

  private startCountDown(): void {
    timer(0, 1000)
      .pipe(
        scan((acc) => --acc, 10),
        takeWhile((sec) => sec >= 0),
        takeUntil(this.destroy$)
      )
      .subscribe((sec) => {
        this.countDown = !!sec ? '00:' + (sec < 10 ? '0' + sec : sec) : null;
      });
  }
}
