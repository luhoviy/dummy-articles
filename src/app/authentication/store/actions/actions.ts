import { createAction, props } from '@ngrx/store';
import {
  AuthProviderType,
  EmailCredentials,
  User,
} from '../../shared/auth.model';
import { FirebaseError } from 'firebase/app';
import { UserInfoFormValue } from '../../../shared/components/user-info-form/user-info-form.component';

export const LOGIN_WITH_EMAIL = 'LOGIN_WITH_EMAIL';
export const LOGIN_WITH_EMAIL_SUCCESS = 'LOGIN_WITH_EMAIL_SUCCESS';
export const LOGIN_WITH_EMAIL_FAILURE = 'LOGIN_WITH_EMAIL_FAILURE';
export const loginWithEmail = createAction(
  LOGIN_WITH_EMAIL,
  props<EmailCredentials>()
);
export const loginWithEmailSuccess = createAction(LOGIN_WITH_EMAIL_SUCCESS);
export const loginWithEmailFailure = createAction(
  LOGIN_WITH_EMAIL_FAILURE,
  props<{ error: FirebaseError; authProviders?: AuthProviderType[] }>()
);

export const LOGIN_WITH_PROVIDER = 'LOGIN_WITH_PROVIDER';
export const LOGIN_WITH_PROVIDER_SUCCESS = 'LOGIN_WITH_PROVIDER_SUCCESS';
export const LOGIN_WITH_PROVIDER_FAILURE = 'LOGIN_WITH_PROVIDER_FAILURE';
export const loginWithProvider = createAction(
  LOGIN_WITH_PROVIDER,
  props<{ providerType: AuthProviderType }>()
);
export const loginWithProviderSuccess = createAction(
  LOGIN_WITH_PROVIDER_SUCCESS
);
export const loginWithProviderFailure = createAction(
  LOGIN_WITH_PROVIDER_FAILURE,
  props<{ error: FirebaseError }>()
);

export const SIGNUP_WITH_EMAIL = 'SIGNUP_WITH_EMAIL';
export const SIGNUP_WITH_EMAIL_SUCCESS = 'SIGNUP_WITH_EMAIL_SUCCESS';
export const SIGNUP_WITH_EMAIL_FAILURE = 'SIGNUP_WITH_EMAIL_FAILURE';
export const signUpWithEmail = createAction(
  SIGNUP_WITH_EMAIL,
  props<{ userInfo: UserInfoFormValue }>()
);
export const signUpWithEmailSuccess = createAction(SIGNUP_WITH_EMAIL_SUCCESS);
export const signUpWithEmailFailure = createAction(
  SIGNUP_WITH_EMAIL_FAILURE,
  props<{ error: FirebaseError }>()
);

export const SAVE_USER_TO_DB = 'SAVE_USER_TO_DB';
export const SAVE_USER_TO_DB_SUCCESS = 'SAVE_USER_TO_DB_SUCCESS';
export const SAVE_USER_TO_DB_FAILURE = 'SAVE_USER_TO_DB_FAILURE';
export const saveUserToDb = createAction(
  SAVE_USER_TO_DB,
  props<{ user: User; setLoadingState?: boolean }>()
);
export const saveUserToDbSuccess = createAction(
  SAVE_USER_TO_DB_SUCCESS,
  props<{ user: User }>()
);
export const saveUserToDbFailure = createAction(
  SAVE_USER_TO_DB_FAILURE,
  props<{ error: FirebaseError }>()
);

export const LINK_ANOTHER_ACCOUNT = 'LINK_ANOTHER_ACCOUNT';
export const LINK_ANOTHER_ACCOUNT_SUCCESS = 'LINK_ANOTHER_ACCOUNT_SUCCESS';
export const LINK_ANOTHER_ACCOUNT_FAILURE = 'LINK_ANOTHER_ACCOUNT_FAILURE';
export const linkAnotherAccount = createAction(
  LINK_ANOTHER_ACCOUNT,
  props<{ providerType: AuthProviderType; credentials?: EmailCredentials }>()
);
export const linkAnotherAccountSuccess = createAction(
  LINK_ANOTHER_ACCOUNT_SUCCESS,
  props<{ user: User }>()
);
export const linkAnotherAccountFailure = createAction(
  LINK_ANOTHER_ACCOUNT_FAILURE,
  props<{ error: FirebaseError }>()
);

export const UNLINK_ANOTHER_ACCOUNT = 'UNLINK_ANOTHER_ACCOUNT';
export const UNLINK_ANOTHER_ACCOUNT_SUCCESS = 'UNLINK_ANOTHER_ACCOUNT_SUCCESS';
export const UNLINK_ANOTHER_ACCOUNT_FAILURE = 'UNLINK_ANOTHER_ACCOUNT_FAILURE';
export const unlinkAnotherAccount = createAction(
  UNLINK_ANOTHER_ACCOUNT,
  props<{ providerType: AuthProviderType }>()
);
export const unlinkAnotherAccountSuccess = createAction(
  UNLINK_ANOTHER_ACCOUNT_SUCCESS,
  props<{ user: User }>()
);
export const unlinkAnotherAccountFailure = createAction(
  UNLINK_ANOTHER_ACCOUNT_FAILURE,
  props<{ error: FirebaseError }>()
);

export const LOGOUT = 'LOGOUT';
export const logout = createAction(LOGOUT);

export const UPDATE_AUTH_STATE = 'UPDATE_AUTH_STATE';
export const updateAuthState = createAction(
  UPDATE_AUTH_STATE,
  props<{ user: User }>()
);

export const UPDATE_CURRENT_USER = 'UPDATE_CURRENT_USER';
export const updateCurrentUser = createAction(
  UPDATE_CURRENT_USER,
  props<{ user: User }>()
);

export const UPDATE_AUTH_LOADING = 'UPDATE_AUTH_LOADING';
export const updateAuthLoading = createAction(
  UPDATE_AUTH_LOADING,
  props<{ isLoading: boolean }>()
);
