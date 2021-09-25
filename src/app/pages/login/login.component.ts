import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromAuthFeature from '../../authentication/store';
import { ClearObservable } from '../../shared/components/clear-observable.component';
import { emailValidator } from '../../shared/utils';
import { getIsNetworkOnline } from '../../store/selectors/app.selectors';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends ClearObservable implements OnInit {
  form: FormGroup;
  hidePassword: boolean = true;
  isNetworkOnline$: Observable<boolean> = this.store.select(getIsNetworkOnline);

  constructor(
    private auth: AngularFireAuth,
    private store: Store,
    private fb: FormBuilder
  ) {
    super();
  }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, emailValidator]],
      password: ['', [Validators.minLength(6), Validators.required]],
    });
  }

  public loginWithEmail(): void {
    const { email, password } = this.form.value;
    this.store.dispatch(fromAuthFeature.loginWithEmail({ email, password }));
  }
}
