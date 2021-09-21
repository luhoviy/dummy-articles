import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { NgxSpinnerService } from 'ngx-spinner';
import { takeUntil } from 'rxjs/operators';
import * as fromAuthFeature from '../../authentication/store';
import { ClearObservable } from '../../shared/components/clear-observable.component';
import { UserInfoFormValue } from '../../shared/components/user-info-form/user-info-form.component';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent extends ClearObservable implements OnInit {
  constructor(private store: Store, private spinner: NgxSpinnerService) {
    super();
  }

  ngOnInit(): void {
    this.store
      .select(fromAuthFeature.getIsAuthLoading)
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoading) => {
        isLoading ? this.spinner.show() : this.spinner.hide();
      });
  }

  public signUp(userInfo: UserInfoFormValue): void {
    this.store.dispatch(fromAuthFeature.signUpWithEmail({ userInfo }));
  }
}
