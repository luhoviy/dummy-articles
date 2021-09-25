import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { AuthProviderType } from '../../../../authentication/shared/auth.model';
import { loginWithProvider } from '../../../../authentication/store';
import { getIsNetworkOnline } from '../../../../store/selectors/app.selectors';
import { ClearObservable } from '../../clear-observable.component';

@Component({
  selector: 'app-auth-providers',
  templateUrl: './auth-providers.component.html',
  styleUrls: ['./auth-providers.component.scss'],
})
export class AuthProvidersComponent extends ClearObservable implements OnInit {
  readonly AuthProviderType = AuthProviderType;
  isNetworkOnline: boolean = true;

  constructor(private store: Store) {
    super();
  }

  ngOnInit(): void {
    this.store
      .select(getIsNetworkOnline)
      .pipe(takeUntil(this.destroy$))
      .subscribe((isOnline) => (this.isNetworkOnline = isOnline));
  }

  public loginWithProvider(providerType: AuthProviderType): void {
    this.store.dispatch(loginWithProvider({ providerType }));
  }
}
