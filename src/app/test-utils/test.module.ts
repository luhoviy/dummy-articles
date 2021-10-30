import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../../environments/environment';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { MockStoreInitialState } from './stub-data';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterTestingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
  ],
  providers: [
    AngularFireAuth,
    AngularFirestore,
    AngularFireStorage,
    provideMockStore({ initialState: MockStoreInitialState }),
  ],
  exports: [RouterTestingModule, AngularFireModule],
})
export class TestModule {}
