import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import firebase from 'firebase/compat/app';
import { AuthProviderType, User } from '../shared/auth.model';
import { AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { MockStore } from '@ngrx/store/testing';
import { MockUser, testEmailAddress } from '../../test-utils/stub-data';
import { of } from 'rxjs';
import * as fromAuthFeature from '../store';
import { Store } from '@ngrx/store';
import { TestModule } from '../../test-utils/test.module';

describe('AuthService', () => {
  let service: AuthService;
  let store:
    | MockStore<fromAuthFeature.AuthState>
    | Store<fromAuthFeature.AuthState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
    });
    service = TestBed.inject(AuthService);
    store = TestBed.get(Store);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('test getProvider method', () => {
    const expectedResult: firebase.auth.AuthProvider =
      new firebase.auth.GoogleAuthProvider();
    // @ts-ignore
    expect(AuthService.getProvider(AuthProviderType.GOOGLE)).toEqual(
      expectedResult
    );
  });

  it('test transformAuthProviderType method', () => {
    const expectedResult = 'Google';
    // @ts-ignore
    expect(
      AuthService.transformAuthProviderType(AuthProviderType.GOOGLE)
    ).toEqual(expectedResult);
  });

  it('test signUp method', () => {
    // @ts-ignore
    spyOn(service.auth, 'createUserWithEmailAndPassword');
    service.signUp(testEmailAddress, 'password');
    // @ts-ignore
    expect(service.auth.createUserWithEmailAndPassword).toHaveBeenCalledWith(
      testEmailAddress,
      'password'
    );
  });

  it('test loginWithEmail method', () => {
    // @ts-ignore
    spyOn(service.auth, 'signInWithEmailAndPassword');
    service.loginWithEmail(testEmailAddress, 'password');
    // @ts-ignore
    expect(service.auth.signInWithEmailAndPassword).toHaveBeenCalledWith(
      testEmailAddress,
      'password'
    );
  });

  it('test logout method', () => {
    // @ts-ignore
    spyOn(service.auth, 'signOut');
    service.logout();
    // @ts-ignore
    expect(service.auth.signOut).toHaveBeenCalled();
  });

  it('test sendPasswordResetEmail method', () => {
    // @ts-ignore
    spyOn(service.auth, 'sendPasswordResetEmail');
    service.sendPasswordResetEmail(testEmailAddress);
    // @ts-ignore
    expect(service.auth.sendPasswordResetEmail).toHaveBeenCalledWith(
      testEmailAddress
    );
  });

  it('test resetPassword method', () => {
    // @ts-ignore
    spyOn(service.auth, 'confirmPasswordReset');
    service.resetPassword('accessToken', 'password');
    // @ts-ignore
    expect(service.auth.confirmPasswordReset).toHaveBeenCalledWith(
      'accessToken',
      'password'
    );
  });

  it('test getAccountProviders method', () => {
    // @ts-ignore
    spyOn(service.auth, 'fetchSignInMethodsForEmail');
    service.getAccountProviders(testEmailAddress);
    // @ts-ignore
    expect(service.auth.fetchSignInMethodsForEmail).toHaveBeenCalledWith(
      testEmailAddress
    );
  });

  it('test saveUserDataToDb method', () => {
    const mockFirestoreDoc = {
      set: (data: User) => null,
    } as AngularFirestoreDocument<User>;

    // @ts-ignore
    spyOn(service.afs, 'doc').and.returnValue(mockFirestoreDoc);
    spyOn(mockFirestoreDoc, 'set');
    service.saveUserDataToDb(MockUser);
    // @ts-ignore
    expect(service.afs.doc).toHaveBeenCalledWith('users/uid666');
    expect(mockFirestoreDoc.set).toHaveBeenCalledWith(MockUser);
  });

  it('test getUserFromDb method', () => {
    const mockFirestoreDoc = {
      get: () => null,
    } as AngularFirestoreDocument<User>;

    // @ts-ignore
    spyOn(service.afs, 'doc').and.returnValue(mockFirestoreDoc);
    spyOn(mockFirestoreDoc, 'get').and.returnValue(of(null));
    service.getUserFromDb(MockUser.id);
    // @ts-ignore
    expect(service.afs.doc).toHaveBeenCalledWith('users/uid666');
    expect(mockFirestoreDoc.get).toHaveBeenCalled();
  });

  it('test mergeAndSaveUser method', () => {
    spyOn(service, 'getUserFromDb').and.returnValue(of(MockUser));
    // @ts-ignore
    spyOn(service.store, 'dispatch');
    service.mergeAndSaveUser(MockUser);
    expect(service.getUserFromDb).toHaveBeenCalledWith(MockUser.id);
    // @ts-ignore
    expect(service.store.dispatch).toHaveBeenCalledWith(
      fromAuthFeature.saveUserToDb({ user: MockUser })
    );
  });
});
