import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {
  AuthProvidersMap,
  AuthProviderType,
} from '../../../../authentication/shared/auth.model';
import { Store } from '@ngrx/store';
import * as fromAuthFeature from '../../../../authentication/store';
import { MatAccordion } from '@angular/material/expansion';
import { filter, take, takeUntil } from 'rxjs/operators';
import { timer } from 'rxjs';
import { ClearObservable } from '../../../../shared/components/clear-observable.component';
import { ConfirmDialogData } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.model';
import { ConfirmationDialogService } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.service';
import { AuthService } from '../../../../authentication/services/auth.service';

@Component({
  selector: 'app-linked-accounts',
  templateUrl: './linked-accounts.component.html',
  styleUrls: ['./linked-accounts.component.scss'],
})
export class LinkedAccountsComponent
  extends ClearObservable
  implements OnInit, AfterViewInit
{
  @ViewChild(MatAccordion) accordion: MatAccordion;
  readonly AuthProviderType = AuthProviderType;
  providersMap: AuthProvidersMap = {};

  constructor(
    private store: Store,
    private confirmDialog: ConfirmationDialogService
  ) {
    super();
  }

  ngOnInit(): void {
    this.store
      .select(fromAuthFeature.getCurrentUser)
      .pipe(
        filter((user) => !!user),
        takeUntil(this.destroy$)
      )
      .subscribe((user) => (this.providersMap = user.providersDataMap));
  }

  ngAfterViewInit(): void {
    timer(500)
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe(() => {
        this.accordion.openAll();
      });
  }

  public linkProvider(providerType: AuthProviderType): void {
    this.store.dispatch(fromAuthFeature.linkAnotherAccount({ providerType }));
  }

  public async unlinkProvider(providerType: AuthProviderType): Promise<void> {
    const config = new ConfirmDialogData();
    config.description = `All ${AuthService.transformAuthProviderType(
      providerType
    )} accounts will be automatically removed.`;
    const confirmed = await this.confirmDialog.open(config).toPromise();
    if (confirmed) {
      this.store.dispatch(
        fromAuthFeature.unlinkAnotherAccount({ providerType })
      );
    }
  }
}
