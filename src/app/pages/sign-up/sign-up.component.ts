import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromAuthFeature from '../../authentication/store';
import { UserInfoFormValue } from '../../shared/components/user-info-form/user-info-form.component';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {
  constructor(private store: Store) {}

  public signUp(userInfo: UserInfoFormValue): void {
    this.store.dispatch(fromAuthFeature.signUpWithEmail({ userInfo }));
  }
}
