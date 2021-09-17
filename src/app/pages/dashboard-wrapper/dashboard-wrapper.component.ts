import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthProviderType } from '../../authentication/shared/auth.model';
import * as fromAuthFeature from '../../authentication/store';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { getAuth, updateProfile } from "@angular/fire/auth";

@Component({
  selector: 'app-dashboard-wrapper',
  templateUrl: './dashboard-wrapper.component.html',
  styleUrls: ['./dashboard-wrapper.component.scss'],
})

export class DashboardWrapperComponent implements OnInit {
  constructor(private store: Store, private auth: AngularFireAuth) {
  }

  ngOnInit(): void {
  }

  updProfile() {

    const auth = getAuth();
    // @ts-ignore
    updateProfile(auth.currentUser, {
      displayName: "ss"
    }).then(res => {
      console.log("updProfile res", res);
    }).catch((error) => {
      console.log("updProfile error", error);
    });
  }

  logout() {
    this.store.dispatch(fromAuthFeature.logout());
  }

  linkEmail() {
    this.store.dispatch(
      fromAuthFeature.linkAnotherAccount({
        providerType: AuthProviderType.PASSWORD,
        credentials: {email: 'rusl220998@gmail.com', password: '123456'},
      })
    );
  }

  unlinkEmail() {
    this.store.dispatch(
      fromAuthFeature.unlinkAnotherAccount({
        providerType: AuthProviderType.PASSWORD,
      })
    );
  }

  linkFb() {
    this.store.dispatch(
      fromAuthFeature.linkAnotherAccount({
        providerType: AuthProviderType.FACEBOOK,
      })
    );
  }

  linkGoogle() {
    this.store.dispatch(
      fromAuthFeature.linkAnotherAccount({
        providerType: AuthProviderType.GOOGLE,
      })
    );
  }

  unlinkFb() {
    this.store.dispatch(
      fromAuthFeature.unlinkAnotherAccount({
        providerType: AuthProviderType.FACEBOOK,
      })
    );
  }

  unlinkGoogle() {
    this.store.dispatch(
      fromAuthFeature.unlinkAnotherAccount({
        providerType: AuthProviderType.GOOGLE,
      })
    );
  }

  linkGithub() {
    this.store.dispatch(
      fromAuthFeature.linkAnotherAccount({
        providerType: AuthProviderType.GITHUB,
      })
    );
  }

  unlinkGithub() {
    this.store.dispatch(
      fromAuthFeature.unlinkAnotherAccount({
        providerType: AuthProviderType.GITHUB,
      })
    );
  }
}
