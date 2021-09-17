import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as fromAuthFeature from '../../authentication/store';
import { ClearObservable } from '../../shared/components/clear-observable.component';
import { getNetworkOnlineState } from '../../store/selectors/network.selectors';
import { EmailCredentials, UserAdditionalInfo } from "../../authentication/shared/auth.model";
import { matchPasswordsValidator } from "../../shared/utils";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent extends ClearObservable implements OnInit {
  form: FormGroup;
  isNetworkOnline$: Observable<boolean> = this.store.select(
    getNetworkOnlineState
  );

  constructor(
    private auth: AngularFireAuth,
    private store: Store,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder
  ) {
    super();
  }

  ngOnInit(): void {
    this.store
      .select(fromAuthFeature.getIsAuthLoading)
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoading) => {
        isLoading ? this.spinner.show() : this.spinner.hide();
      });

    this.initForm();
  }

  private initForm(): void {
    this.form = this.fb.group(
      {
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: [''],
        email: ['', [Validators.email, Validators.required]],
        password: ['', [Validators.minLength(6), Validators.required]],
        passwordConfirmation: [
          '',
          [Validators.minLength(6), Validators.required],
        ],
      },
      {
        validators: matchPasswordsValidator(
          'password',
          'passwordConfirmation'
        )
      }
    );
  }

  public signUp(): void {
    const credentials: EmailCredentials = {...this.form.value};
    const info: UserAdditionalInfo = {...this.form.value}
    this.store.dispatch(fromAuthFeature.signUpWithEmail({credentials, info}));
  }
}
