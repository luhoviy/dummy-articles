import { AuthProviderType, User } from '../authentication/shared/auth.model';
import { InitialSearchConfig } from '../pages/main-routes/articles/shared/constants';

export const MockStoreInitialState = {
  networkState: {
    isOnline: true,
  },
  authentication: {
    user: null,
    initialAuthState: false,
  },
  widgets: {
    weather: null,
    geolocation: null,
    nytNews: null,
  },
  articles: {
    list: null,
    articleAuthors: [],
    searchConfig: InitialSearchConfig,
    isLoading: false,
  },
};

export const MockUser: User = {
  firstName: 'John',
  lastName: 'Doe',
  displayName: 'John Doe',
  email: 'john.doe@mail.com',
  birthDate: null,
  photoUrl: null,
  id: 'uid666',
  providerTypes: [AuthProviderType.PASSWORD, AuthProviderType.GOOGLE],
  providersDataMap: {
    'google.com': [
      {
        providerId: 'google.com',
        uid: '113337177230187621314',
        displayName: 'John Doe',
        email: 'john.doe@gmail.com',
        phoneNumber: null,
        photoURL: null,
      },
    ],
    password: [
      {
        providerId: 'password',
        uid: 'uid666',
        displayName: 'John Doe',
        email: 'john.doe@mail.com',
        phoneNumber: null,
        photoURL: null,
      },
    ],
  },
  metadata: {
    lastSignInTime: 'Sat, 30 Oct 2021 17:41:52 GMT',
    creationTime: 'Sat, 16 Oct 2021 19:28:12 GMT',
  },
};

export const testEmailAddress = 'test@mail.com';
