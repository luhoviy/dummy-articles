import { Component, OnInit } from '@angular/core';
import { AuthProviderType } from '../../../../authentication/shared/auth.model';
import { Store } from '@ngrx/store';
import * as fromAuthFeature from '../../../../authentication/store';

@Component({
  selector: 'app-linked-accounts',
  templateUrl: './linked-accounts.component.html',
  styleUrls: ['./linked-accounts.component.scss'],
})
export class LinkedAccountsComponent implements OnInit {
  readonly AuthProviderType = AuthProviderType;

  constructor(private store: Store) {}

  ngOnInit(): void {}

  public linkProvider(providerType: AuthProviderType): void {
    if (providerType === AuthProviderType.PASSWORD) {
      console.log('password');
      return;
    }

    this.store.dispatch(fromAuthFeature.linkAnotherAccount({ providerType }));
  }

  public unlinkProvider(providerType: AuthProviderType): void {
    this.store.dispatch(fromAuthFeature.unlinkAnotherAccount({ providerType }));
  }
}
