import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CHANGE_USER_PASSWORD_SUCCESS } from '../../../authentication/store';
import { getIsNetworkOnline } from '../../../store/selectors/app.selectors';
import {
  matchingOldPasswordValidator,
  matchPasswordsValidator,
} from '../../utils';
import { ClearObservable } from '../clear-observable.component';

export interface NewPasswordFormResponse {
  newPassword: string;
  oldPassword?: string;
}

@Component({
  selector: 'app-new-password-form',
  templateUrl: './new-password-form.component.html',
  styleUrls: ['./new-password-form.component.scss'],
})
export class NewPasswordFormComponent
  extends ClearObservable
  implements OnInit, OnChanges
{
  @ViewChild('formDirective') formDirective: NgForm;
  @Input() isLoading: boolean;
  @Input() askOldPassword: boolean;
  @Input() submitButtonText: string = 'Reset Password';
  @Output() onSubmit = new EventEmitter<NewPasswordFormResponse>();
  isNetworkOnline$: Observable<boolean> = this.store.select(getIsNetworkOnline);
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private actions$: Actions
  ) {
    super();
  }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    const change = changes.askOldPassword;
    if (!!change && !change.firstChange) {
      this.initForm();
      this.formDirective.resetForm();
    }
  }

  private initForm(): void {
    const validators = [
      matchPasswordsValidator('newPassword', 'newPasswordConfirmation'),
    ];

    if (this.askOldPassword) {
      validators.push(
        matchingOldPasswordValidator('oldPassword', 'newPassword')
      );

      this.actions$
        .pipe(ofType(CHANGE_USER_PASSWORD_SUCCESS), takeUntil(this.destroy$))
        .subscribe(() => {
          this.formDirective.resetForm();
        });
    }

    this.form = this.fb.group(
      {
        oldPassword: ['', [Validators.minLength(6), Validators.required]],
        newPassword: ['', [Validators.minLength(6), Validators.required]],
        newPasswordConfirmation: [
          '',
          [Validators.minLength(6), Validators.required],
        ],
      },
      { validators }
    );

    if (!this.askOldPassword) {
      this.form.removeControl('oldPassword');
    }
  }
}
