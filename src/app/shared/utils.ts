import firebase from 'firebase/compat';
import { isEmpty } from 'lodash';
import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';
import { User } from '../authentication/shared/auth.model';
import isEmail from 'validator/lib/isEmail';

export const ParseFirebaseErrorMessage = (
  error: firebase.FirebaseError
): string => {
  if (isEmpty(error) || !!!error.message) return '';
  return error.message
    .replace('Firebase: ', '')
    .replace(`(${error.code}).`, '');
};

export const mergeUserWithDbUserRecord = (user: User, dbUser: User): User => {
  delete dbUser.metadata;
  delete dbUser.providerTypes;
  delete dbUser.providersDataMap;
  return { ...user, ...dbUser };
};

// --------- Custom form validators ---------

export const matchPasswordsValidator = (
  newPasswordControlName: string,
  matchingNewPasswordControlName: string
) => {
  return (formGroup: FormGroup) => {
    const newPasswordControl = formGroup.controls[newPasswordControlName];
    const matchingControl = formGroup.controls[matchingNewPasswordControlName];
    if (matchingControl.errors && !matchingControl.errors.passwordsNotEqual)
      return;
    if (newPasswordControl.value !== matchingControl.value) {
      matchingControl.setErrors({ passwordsNotEqual: true });
      return;
    }
    matchingControl.setErrors(null);
  };
};

export const matchingOldPasswordValidator = (
  oldPasswordControlName: string,
  newPasswordControlName: string
) => {
  return (formGroup: FormGroup) => {
    const oldPasswordControl = formGroup.controls[oldPasswordControlName];
    const newPasswordControl = formGroup.controls[newPasswordControlName];

    if (
      newPasswordControl.errors &&
      !newPasswordControl.errors.newPasswordIsEqualToOld
    )
      return;
    if (
      !!oldPasswordControl.value &&
      newPasswordControl.value === oldPasswordControl.value
    ) {
      newPasswordControl.setErrors({ newPasswordIsEqualToOld: true });
      return;
    }
    newPasswordControl.setErrors(null);
  };
};

export const emailValidator = (
  control: AbstractControl
): ValidationErrors | null =>
  !!!control.value || isEmail(control.value) ? null : { email: true };
