import firebase from 'firebase/compat';
import { isEmpty, times } from 'lodash';
import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';
import { User } from '../authentication/shared/auth.model';
import isEmail from 'validator/lib/isEmail';
import * as faker from 'faker';
import {
  Article,
  SearchConfig,
} from '../pages/main-routes/articles/shared/models';
import { ARTICLE_CATEGORIES_LIST } from '../pages/main-routes/articles/shared/constants';

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

export const saveDataToLocaleStorage = (key: string, data: any): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const getDataFromLocaleStorage = (key: string): any => {
  return JSON.parse(localStorage.getItem(key));
};

export const getUserSearchConfigFromLocaleStorage = (
  userId: string
): SearchConfig => {
  const savedConfigs: { [userId: string]: SearchConfig } =
    getDataFromLocaleStorage('searchConfigs') || {};
  return savedConfigs[userId];
};

export const createFakeUsers = (count: number): User[] => {
  const avatars: string[] = [
    'https://firebasestorage.googleapis.com/v0/b/dummy-articles.appspot.com/o/users%2Fyoung-woman-fooling-around-black-wall.jpeg?alt=media&token=7e766e1e-020f-4ed7-a91f-da56c691fbc0',
    'https://firebasestorage.googleapis.com/v0/b/dummy-articles.appspot.com/o/users%2Fp5quSf4dZXctG9WFepXFdR.jpeg?alt=media&token=6e06a53d-9238-4fff-b201-20f536e6bb5d',
    'https://firebasestorage.googleapis.com/v0/b/dummy-articles.appspot.com/o/users%2Fhappy-man-with-long-thick-ginger-beard-has-friendly-smile.jpeg?alt=media&token=5373026c-17bd-49aa-8598-9f687330d448',
    'https://firebasestorage.googleapis.com/v0/b/dummy-articles.appspot.com/o/users%2Fgorgeous-girl-with-beautiful-face.jpeg?alt=media&token=b946b1fb-ac06-4f2d-adfe-25671c321a29',
    'https://firebasestorage.googleapis.com/v0/b/dummy-articles.appspot.com/o/users%2FHeadshots_Prague-emotional-portrait-of-a-smiling-entrepreneur-1.jpeg?alt=media&token=aaae0c54-ed06-4c1c-920c-70c790424d9e',
    'https://firebasestorage.googleapis.com/v0/b/dummy-articles.appspot.com/o/users%2Fe3c0b57e39b9038b5a33a28d7953f24d.jpeg?alt=media&token=c5405aad-90a1-4cc3-89c7-d297d040a080',
  ];

  return times(count, () => {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();

    return {
      id: faker.datatype.uuid(),
      displayName: `${firstName} ${lastName}`,
      firstName,
      lastName,
      email: faker.internet.email(),
      photoUrl: avatars[Math.round(faker.datatype.number(avatars.length - 1))],
      birthDate: faker.date
        .past(Math.round(faker.datatype.number(90)))
        .toUTCString(),
    };
  }) as User[];
};

export const createFakeArticles = (): Article[] => {
  const authorIDs: string[] = [
    '81d96d17-1545-4289-a2f7-33820fef6a7e',
    'd32b90e7-f95f-4077-83cb-b4a004c35f1e',
    '25744d8c-dc47-4d71-acb7-e969b798f660',
    'ced1ae55-e5f6-4daf-8638-2ba0f28494bf',
    '69664249-45aa-4452-a1c8-8c65cc5fa4d1',
    'f71a0a93-93a9-48a6-a59a-955f2dce0624',
  ];

  return times(50, () => ({
    id: faker.datatype.uuid(),
    authorId:
      authorIDs[Math.round(faker.datatype.number(authorIDs.length - 1))],
    description: faker.lorem.words(Math.round(faker.datatype.number(1000))),
    category:
      ARTICLE_CATEGORIES_LIST[
        Math.round(faker.datatype.number(ARTICLE_CATEGORIES_LIST.length - 1))
      ],
    createdAt: faker.date.past(Math.round(faker.datatype.number(5))).getTime(),
    title: faker.lorem.words(Math.round(faker.datatype.number(10))),
    coverPhotoUrl: `https://picsum.photos/seed/${faker.datatype.uuid()}/1920/1080`,
  })) as Article[];
};
