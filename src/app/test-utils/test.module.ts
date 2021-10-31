import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../../environments/environment';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { MockStoreInitialState } from './mock-data';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    RouterTestingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    MatSnackBarModule,
    MatIconModule,
    MatButtonModule,
    FlexLayoutModule,
  ],
  providers: [
    AngularFireAuth,
    AngularFirestore,
    AngularFireStorage,
    provideMockStore({ initialState: MockStoreInitialState }),
  ],
  exports: [
    RouterTestingModule,
    AngularFireModule,
    MatIconModule,
    MatButtonModule,
    FlexLayoutModule,
  ],
})
export class TestModule {}
