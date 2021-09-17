import firebase from 'firebase/compat/app';
import { assign, cloneDeep, groupBy, isEmpty, uniq } from 'lodash';

export interface EmailCredentials {
  email: string;
  password: string;
}

export enum AuthProviderType {
  PASSWORD = 'password',
  GOOGLE = 'google.com',
  FACEBOOK = 'facebook.com',
  GITHUB = 'github.com'
}

export interface AuthProvidersMap {
  [id: string]: firebase.UserInfo[]
}

export class User {
  firstName: string;
  lastName: string = '';
  displayName: string;
  email: string;
  photoUrl: string;
  id: string;
  providerTypes: AuthProviderType[];
  providersDataMap: AuthProvidersMap;
  metadata: firebase.auth.UserMetadata;

  constructor(firebaseUser: firebase.User, additionalInfo?: UserAdditionalInfo) {
    firebaseUser = cloneDeep(firebaseUser);
    this.displayName = this.firstName = firebaseUser.displayName || 'Anonymous';
    this.email = firebaseUser.email;
    this.photoUrl = firebaseUser.photoURL || 'assets/icons/user.png';
    this.id = firebaseUser.uid;
    this.providersDataMap = groupBy(firebaseUser.providerData, 'providerId');
    this.providerTypes = uniq(firebaseUser.providerData.map(
      (provider) => provider.providerId
    )) as AuthProviderType[];
    this.metadata = assign({}, firebaseUser.metadata);
    if (!isEmpty(additionalInfo)) {
      this.firstName = !!additionalInfo.firstName
        ? additionalInfo.firstName
        : this.displayName;
      if (!!additionalInfo.lastName) {
        this.lastName = additionalInfo.lastName;
        this.displayName = `${this.firstName} ${this.lastName}`;
      }
    }
  }
}

export interface UserAdditionalInfo {
  firstName: string;
  lastName: string;
  isNewUser?: boolean;
}


