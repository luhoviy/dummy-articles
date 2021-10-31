import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasswordRecoveryComponent } from './password-recovery.component';
import { TestModule } from '../../test-utils/test.module';
import { AuthLayoutModule } from '../../shared/components/auth-layout/auth-layout.module';
import { MatMenuModule } from '@angular/material/menu';
import { ConfirmationDialogModule } from '../../shared/components/confirmation-dialog/confirmation-dialog.module';
import { NewPasswordFormModule } from '../../shared/components/new-password-form/new-password-form.module';
import { MockUser, testEmailAddress } from '../../test-utils/mock-data';
import { of } from 'rxjs';
import { MockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import * as fromAuthFeature from '../../authentication/store';
import { changeUserPasswordSuccess, logout } from '../../authentication/store';
import { NewPasswordFormResponse } from '../../shared/components/new-password-form/new-password-form.component';
import { AuthProviderType } from '../../authentication/shared/auth.model';
import firebase from 'firebase/compat';
import { Actions } from '@ngrx/effects';

describe('PasswordRecoveryComponent', () => {
  let component: PasswordRecoveryComponent;
  let fixture: ComponentFixture<PasswordRecoveryComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PasswordRecoveryComponent],
      imports: [
        TestModule,
        AuthLayoutModule,
        MatMenuModule,
        ConfirmationDialogModule,
        NewPasswordFormModule,
      ],
      providers: [
        {
          provide: Actions,
          useValue: of(changeUserPasswordSuccess()),
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordRecoveryComponent);
    component = fixture.componentInstance;
    store = TestBed.get(Store);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create emailControl onInit', () => {
    component.emailControl = null;
    component.ngOnInit();
    expect(component.emailControl).toBeTruthy();
  });

  it('should emailControl value if targetEmailAddress is presented onInit', () => {
    component.targetEmailAddress = testEmailAddress;
    component.ngOnInit();
    expect(component.emailControl.value).toEqual(testEmailAddress);
  });

  describe('sendResetPasswordEmail method', () => {
    beforeEach(() => {
      component.emailControl.setValue(testEmailAddress);
      // @ts-ignore
      spyOn(component.authService, 'sendPasswordResetEmail').and.returnValue(
        of(null)
      );
    });

    it('should call sendPasswordResetEmail from AuthService', () => {
      component.sendResetPasswordEmail();
      // @ts-ignore
      expect(component.authService.sendPasswordResetEmail).toHaveBeenCalledWith(
        testEmailAddress
      );
    });

    it('should call startCountDown method if startCountDown param is true ', () => {
      // @ts-ignore
      spyOn(component, 'startCountDown');
      component.sendResetPasswordEmail(true);
      // @ts-ignore
      expect(component.startCountDown).toHaveBeenCalled();
    });
  });

  describe('resetPassword method', () => {
    const newPassword: NewPasswordFormResponse = {
      newPassword: 'password',
    };

    beforeEach(() => {
      component.accessToken = 'token';
      store.overrideSelector(fromAuthFeature.getCurrentUser, MockUser);
      // @ts-ignore
      spyOn(component.authService, 'resetPassword').and.returnValue(of(null));
    });

    it('should reset password and complete flow', () => {
      // @ts-ignore
      spyOn(component, 'handleResetPasswordSuccess');
      component.resetPassword(newPassword);
      // @ts-ignore
      expect(component.authService.resetPassword).toHaveBeenCalledWith(
        'token',
        'password'
      );
      // @ts-ignore
      expect(component.handleResetPasswordSuccess).toHaveBeenCalledWith(
        MockUser
      );
    });

    it('should present confirm dialog if user has 3d party auth providers', async () => {
      component.targetEmailAddress = testEmailAddress;
      // @ts-ignore
      spyOn(component.authService, 'getAccountProviders').and.returnValue(
        of([AuthProviderType.GOOGLE])
      );
      // @ts-ignore
      spyOn(component.confirmDialog, 'open').and.returnValue(of(false));
      await component.resetPassword(newPassword);
      // @ts-ignore
      expect(component.confirmDialog.open).toHaveBeenCalled();
    });
  });

  it('test handleError method', () => {
    const mockFirebaseError = {
      code: 'auth/expired-action-code',
    } as firebase.FirebaseError;
    // @ts-ignore
    spyOn(component.notifications, 'error');
    // @ts-ignore
    component.handleError(mockFirebaseError);
    // @ts-ignore
    expect(component.notifications.error).toHaveBeenCalledWith(
      'Your reset token is expired or invalid!',
      0,
      true
    );
  });

  describe('handleResetPasswordSuccess method', () => {
    it('should change passwordChanged state', () => {
      component.passwordChanged = false;
      // @ts-ignore
      component.handleResetPasswordSuccess(null);
      expect(component.passwordChanged).toBeTruthy();
    });

    it('should dispatch logout action if currently logged in user has been changed a password', () => {
      component.targetEmailAddress = MockUser.email;
      // @ts-ignore
      spyOn(component.store, 'dispatch');
      // @ts-ignore
      component.handleResetPasswordSuccess(MockUser);
      // @ts-ignore
      expect(component.store.dispatch).toHaveBeenCalledWith(logout());
    });
  });

  it('test useAnotherEmail method', () => {
    component.resetEmailSuccessfullySent = true;
    spyOn(component.emailControl, 'setValue');
    spyOn(component.emailControl, 'markAsUntouched');
    component.useAnotherEmail();
    expect(component.emailControl.setValue).toHaveBeenCalledWith('');
    expect(component.emailControl.markAsUntouched).toHaveBeenCalled();
    expect(component.resetEmailSuccessfullySent).toBeFalse();
  });

  describe('template test', () => {
    let componentElement: HTMLElement;

    beforeEach(() => {
      componentElement = fixture.debugElement.nativeElement;
    });

    describe('test email area', () => {
      beforeEach(() => (component.accessToken = null));

      it('email input should be presented if resetEmailSuccessfullySent is falsy', () => {
        component.resetEmailSuccessfullySent = false;
        fixture.detectChanges();
        const input = componentElement.querySelector('input[name="email"]');
        const emailLabel = componentElement.querySelector('p');
        expect(input).toBeTruthy();
        expect(emailLabel.textContent).toContain(
          "Enter the email you're using for your account."
        );
      });

      it('success result area should be presented if resetEmailSuccessfullySent is true ', () => {
        component.resetEmailSuccessfullySent = true;
        component.emailControl.setValue(testEmailAddress);
        fixture.detectChanges();
        const successArea = componentElement.querySelector(
          '.password-recovery-container__success-result'
        );
        const successTextWrapper = successArea.querySelector('.mat-body');
        expect(successArea).toBeTruthy();
        expect(successTextWrapper).toBeTruthy();
        expect(successTextWrapper.textContent).toContain(
          `Reset instructions has been sent to ${testEmailAddress}`
        );
      });
    });

    describe('test change password area', () => {
      beforeEach(() => (component.accessToken = 'token'));

      it('new password form should be presented if passwordChanged is falsy', () => {
        component.passwordChanged = false;
        fixture.detectChanges();
        const newPasswordComponent = componentElement.querySelector(
          'app-new-password-form'
        );
        expect(newPasswordComponent).toBeTruthy();
      });

      it('success result area should be presented if passwordChanged is true ', () => {
        component.passwordChanged = true;
        fixture.detectChanges();
        const successArea = componentElement.querySelector(
          '.password-recovery-container__success-result'
        );
        const successTextWrapper = successArea.querySelector('.mat-body');
        expect(successArea).toBeTruthy();
        expect(successTextWrapper).toBeTruthy();
        expect(successTextWrapper.textContent).toContain(
          'Password has been successfully changed'
        );
      });
    });
  });
});
