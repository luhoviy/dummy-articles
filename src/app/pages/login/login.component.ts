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

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends ClearObservable implements OnInit {
  form: FormGroup;
  hidePassword: boolean = true;
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
    this.form = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.minLength(6), Validators.required]],
    });
  }

  public loginWithEmail(): void {
    const { email, password } = this.form.value;
    this.store.dispatch(fromAuthFeature.loginWithEmail({ email, password }));
  }
}
