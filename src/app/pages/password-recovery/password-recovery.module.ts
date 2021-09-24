import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordRecoveryComponent } from './password-recovery.component';
import { RouterModule } from '@angular/router';
import { AuthLayoutModule } from '../../shared/components/auth-layout/auth-layout.module';
import { MatMenuModule } from '@angular/material/menu';
import { ConfirmationDialogModule } from '../../shared/components/confirmation-dialog/confirmation-dialog.module';
import { NewPasswordFormModule } from '../../shared/components/new-password-form/new-password-form.module';

@NgModule({
  declarations: [PasswordRecoveryComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: PasswordRecoveryComponent,
      },
      {
        path: '**',
        redirectTo: '',
      },
    ]),
    AuthLayoutModule,
    MatMenuModule,
    ConfirmationDialogModule,
    NewPasswordFormModule,
  ],
})
export class PasswordRecoveryModule {}
