import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignUpComponent } from './sign-up.component';
import { RouterModule } from '@angular/router';
import { AuthLayoutModule } from '../../shared/components/auth-layout/auth-layout.module';
import { UserInfoFormModule } from '../../shared/components/user-info-form/user-info-form.module';

@NgModule({
  declarations: [SignUpComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: SignUpComponent,
      },
      {
        path: '**',
        redirectTo: '',
      },
    ]),
    AuthLayoutModule,
    UserInfoFormModule,
  ],
})
export class SignUpModule {}
