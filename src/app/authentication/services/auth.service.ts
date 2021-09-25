import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { fromPromise } from 'rxjs/internal-compatibility';
import firebase from 'firebase/compat/app';
import { Observable, of } from 'rxjs';
import { AuthProviderType, EmailCredentials, User } from '../shared/auth.model';
import {
  EmailAuthProvider,
  getAuth,
  linkWithCredential,
  linkWithPopup,
  reauthenticateWithCredential,
  signInWithPopup,
  unlink,
  updatePassword,
  updateProfile,
} from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { assign } from 'lodash';
import { filter, take } from 'rxjs/operators';
import * as fromAuthFeature from '../store';
import { mergeUserWithDbUserRecord } from '../../shared/utils';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private auth: AngularFireAuth,
    private afs: AngularFirestore,
    private store: Store
  ) {}

  private static getProvider(
    providerType: AuthProviderType
  ): firebase.auth.AuthProvider {
    let provider: firebase.auth.AuthProvider;

    switch (providerType) {
      case AuthProviderType.GOOGLE:
        provider = new firebase.auth.GoogleAuthProvider();
        break;
      case AuthProviderType.FACEBOOK:
        provider = new firebase.auth.FacebookAuthProvider();
        break;
      case AuthProviderType.GITHUB:
        provider = new firebase.auth.GithubAuthProvider();
        break;
    }

    return provider;
  }

  public static transformAuthProviderType(
    providerType: AuthProviderType | AuthProviderType[]
  ): string | string[] {
    const transform = (type: AuthProviderType): string => {
      switch (type) {
        case AuthProviderType.GOOGLE:
          return 'Google';
        case AuthProviderType.FACEBOOK:
          return 'Facebook';
        case AuthProviderType.PASSWORD:
          return 'Email';
        case AuthProviderType.GITHUB:
          return 'Github';
        default:
          return '';
      }
    };

    return Array.isArray(providerType)
      ? providerType.map((type) => transform(type))
      : transform(providerType);
  }

  public signUp(
    email: string,
    password: string
  ): Observable<firebase.auth.UserCredential> {
    return fromPromise(
      this.auth.createUserWithEmailAndPassword(email, password)
    );
  }

  public loginWithEmail(
    email: string,
    password: string
  ): Observable<firebase.auth.UserCredential> {
    return fromPromise(this.auth.signInWithEmailAndPassword(email, password));
  }

  public loginWithProvider(
    providerType: AuthProviderType
  ): Observable<firebase.auth.UserCredential> {
    const provider = AuthService.getProvider(providerType);
    return !!provider
      ? fromPromise(signInWithPopup(getAuth(), provider))
      : of(null);
  }

  public logout(): Observable<void> {
    return fromPromise(this.auth.signOut());
  }

  public linkAnotherAccount(
    providerType: AuthProviderType,
    emailCredentials?: EmailCredentials
  ): Observable<firebase.auth.UserCredential> {
    const auth = getAuth();

    if (providerType === AuthProviderType.PASSWORD) {
      const credential = EmailAuthProvider.credential(
        emailCredentials.email,
        emailCredentials.password
      );
      // @ts-ignore
      return fromPromise(linkWithCredential(auth.currentUser, credential));
    }

    const provider = AuthService.getProvider(providerType);
    // @ts-ignore
    return fromPromise(linkWithPopup(auth.currentUser, provider));
  }

  public unlinkAnotherAccount(
    providerType: AuthProviderType
  ): Observable<firebase.User> {
    const auth = getAuth();
    // @ts-ignore
    return fromPromise(unlink(auth.currentUser, providerType));
  }

  public sendPasswordResetEmail(email: string): Observable<void> {
    return fromPromise(this.auth.sendPasswordResetEmail(email));
  }

  public resetPassword(
    accessToken: string,
    newPassword: string
  ): Observable<void> {
    return fromPromise(
      this.auth.confirmPasswordReset(accessToken, newPassword)
    );
  }

  public verifyCurrentPassword(
    emailCredentials: EmailCredentials
  ): Observable<firebase.auth.UserCredential> {
    const auth = getAuth();
    const credential = EmailAuthProvider.credential(
      emailCredentials.email,
      emailCredentials.password
    );
    // @ts-ignore
    return fromPromise(
      reauthenticateWithCredential(auth.currentUser, credential)
    );
  }

  public changeUserPassword(newPassword: string): Observable<void> {
    const auth = getAuth();
    return fromPromise(updatePassword(auth.currentUser, newPassword));
  }

  public getAccountProviders(email: string): Observable<AuthProviderType[]> {
    return fromPromise(
      this.auth.fetchSignInMethodsForEmail(email)
    ) as Observable<AuthProviderType[]>;
  }

  public saveUserDataToDb(user: User) {
    user = assign({}, user);
    const userDoc = this.afs.doc<User>(`users/${user.id}`);
    return fromPromise(userDoc.set(user));
  }

  public getUserFromDb(id: string): Observable<User> {
    const userDoc = this.afs.doc<User>(`users/${id}`);
    return userDoc.valueChanges();
  }

  public mergeAndSaveUser(user: User, locallyOnly: boolean = false): void {
    this.getUserFromDb(user.id)
      .pipe(
        take(1),
        filter((res) => !!res)
      )
      .subscribe(
        (dbUser) => {
          const mergedUser = mergeUserWithDbUserRecord(user, dbUser);
          this.store.dispatch(
            locallyOnly
              ? fromAuthFeature.updateCurrentUser({ user: mergedUser })
              : fromAuthFeature.saveUserToDb({ user: mergedUser })
          );
        },
        (err) => console.log('mergeAndSaveUser error', err)
      );
  }

  public updateUserInFirebaseAuthStore(user: User) {
    const auth = getAuth();
    fromPromise(
      updateProfile(auth.currentUser, {
        displayName: user.displayName,
        photoURL: user.photoUrl,
      })
    ).subscribe(
      () => null,
      (err) => console.log('updateUserInFirebaseAuthStore error', err)
    );
  }
}
