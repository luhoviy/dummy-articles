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
  controlName: string,
  matchingControlName: string
) => {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];
    if (matchingControl.errors && !matchingControl.errors.passwordsNotEqual)
      return;
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ passwordsNotEqual: true });
      return;
    }
    matchingControl.setErrors(null);
  };
};

export const emailValidator = (
  control: AbstractControl
): ValidationErrors | null =>
  !!!control.value || isEmail(control.value) ? null : { email: true };
