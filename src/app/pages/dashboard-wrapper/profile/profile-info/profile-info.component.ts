import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../../../authentication/shared/auth.model';
import { MatDialog } from '@angular/material/dialog';
import { UserInfoFormComponent } from '../../../../shared/components/user-info-form/user-info-form.component';
import { Store } from '@ngrx/store';
import { ClearObservable } from '../../../../shared/components/clear-observable.component';
import { take, takeUntil } from 'rxjs/operators';
import * as fromAuthFeature from '../../../../authentication/store';
import { saveUserToDb } from '../../../../authentication/store';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { getNetworkOnlineState } from '../../../../store/selectors/network.selectors';

@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.scss'],
})
export class ProfileInfoComponent extends ClearObservable implements OnInit {
  @Input() user: User;
  isNetworkOnline$: Observable<boolean> = this.store.select(
    getNetworkOnlineState
  );

  constructor(
    private dialog: MatDialog,
    private store: Store,
    private spinner: NgxSpinnerService
  ) {
    super();
  }

  ngOnInit() {
    this.store
      .select(fromAuthFeature.getIsAuthLoading)
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoading) => {
        isLoading ? this.spinner.show() : this.spinner.hide();
      });
  }

  public openEditModal(): void {
    const dialog = this.dialog.open(UserInfoFormComponent, {
      data: { ...this.user },
      width: '500px',
      maxWidth: '90vw',
      autoFocus: false,
    });

    dialog
      .afterClosed()
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe((modifiedUser: User | null) => {
        if (!!modifiedUser) {
          this.store.dispatch(
            saveUserToDb({ user: modifiedUser, setLoadingState: true })
          );
        }
      });
  }
}
