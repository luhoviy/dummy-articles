import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewPasswordFormComponent } from './new-password-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [NewPasswordFormComponent],
  exports: [NewPasswordFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class NewPasswordFormModule {}
