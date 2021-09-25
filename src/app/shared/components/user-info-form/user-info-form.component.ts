import {
  Component,
  EventEmitter,
  Inject,
  OnInit,
  Optional,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { matchPasswordsValidator } from '../../utils';
import { Observable } from 'rxjs';
import { getIsNetworkOnline } from '../../../store/selectors/app.selectors';
import { Store } from '@ngrx/store';
import { User } from '../../../authentication/shared/auth.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { isEqual } from 'lodash';

export interface UserInfoFormValue {
  firstName: string;
  lastName: string;
  birthDate: string;
  email?: string;
  password?: string;
}

@Component({
  selector: 'app-user-info-form',
  templateUrl: './user-info-form.component.html',
  styleUrls: ['./user-info-form.component.scss'],
})
export class UserInfoFormComponent implements OnInit {
  @Output() onSubmit: EventEmitter<UserInfoFormValue> = new EventEmitter();
  form: FormGroup;
  minDate = new Date(1900, 0, 1);
  maxDate = new Date(
    new Date().getFullYear() - 5,
    new Date().getMonth(),
    new Date().getDate()
  );
  isNetworkOnline$: Observable<boolean> = this.store.select(getIsNetworkOnline);
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    @Optional() private dialogRef: MatDialogRef<UserInfoFormComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public user: User
  ) {
    this.isEditMode = !!user;
  }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.form = this.fb.group(
      {
        firstName: [
          this.user ? this.user.firstName : '',
          [Validators.required, Validators.minLength(2)],
        ],
        lastName: [this.user ? this.user.lastName : ''],
        birthDate: [
          this.user && !!this.user.birthDate
            ? new Date(this.user.birthDate)
            : null,
        ],
        email: ['', [Validators.email, Validators.required]],
        password: ['', [Validators.minLength(6), Validators.required]],
        passwordConfirmation: [
          '',
          [Validators.minLength(6), Validators.required],
        ],
      },
      {
        validators: !this.isEditMode
          ? matchPasswordsValidator('password', 'passwordConfirmation')
          : null,
      }
    );

    if (this.isEditMode) {
      this.form.controls.email.disable();
      this.form.controls.password.disable();
      this.form.controls.passwordConfirmation.disable();
    }
  }

  public submit(): void {
    const result: UserInfoFormValue = { ...this.form.value };
    Object.keys(result).forEach((key) => {
      result[key] =
        typeof result[key] === 'string'
          ? (result[key] as string).trim()
          : result[key];
    });

    result.birthDate =
      this.form.value.birthDate instanceof Object
        ? new Date(result.birthDate.toString()).toUTCString()
        : result.birthDate;

    if (this.isEditMode) {
      const initialUser = { ...this.user };
      this.user = { ...this.user, ...result };
      this.user.displayName = !!this.user.lastName
        ? `${this.user.firstName} ${this.user.lastName}`
        : this.user.firstName;
      this.closeModal(isEqual(initialUser, this.user) ? null : this.user);
      return;
    }

    this.onSubmit.emit(result);
  }

  public closeModal(result: User = null): void {
    this.dialogRef.close(result);
  }
}
