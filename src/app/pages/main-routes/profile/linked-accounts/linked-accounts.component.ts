import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AuthProvidersMap, AuthProviderType, } from '../../../../authentication/shared/auth.model';
import { Store } from '@ngrx/store';
import * as fromAuthFeature from '../../../../authentication/store';
import { MatAccordion } from '@angular/material/expansion';
import { filter, take, takeUntil } from 'rxjs/operators';
import { timer } from 'rxjs';
import { ClearObservable } from '../../../../shared/components/clear-observable.component';
import { ConfirmDialogData } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.model';
import { ConfirmationDialogService } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.service';
import { AuthService } from '../../../../authentication/services/auth.service';
import { NotificationsService } from "../../../../shared/services/notifications.service";

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
  connectedProviders: AuthProviderType[];

  constructor(
    private store: Store,
    private confirmDialog: ConfirmationDialogService,
    private notifications: NotificationsService
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
      .subscribe(user => {
        this.providersMap = user.providersDataMap;
        this.connectedProviders = user.providerTypes;
      });
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
    const transformedProviderType = AuthService.transformAuthProviderType(providerType);
    if (!this.connectedProviders.includes(AuthProviderType.PASSWORD) && this.connectedProviders.length === 1) {
      this.notifications.error(
        `Forbidden: To remove ${transformedProviderType} accounts, you must first set a password or link the account using other types of authentication providers.`,
        5
      )
      return;
    }

    const config = new ConfirmDialogData();
    config.description = `All ${transformedProviderType} accounts will be automatically removed.`;
    const confirmed = await this.confirmDialog.open(config).toPromise();
    if (confirmed) {
      this.store.dispatch(
        fromAuthFeature.unlinkAnotherAccount({providerType})
      );
    }
  }
}
