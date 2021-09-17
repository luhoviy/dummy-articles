import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignUpComponent } from './sign-up.component';
import { RouterModule } from '@angular/router';
import { AuthLayoutModule } from '../../shared/components/auth-layout/auth-layout.module';

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
    AuthLayoutModule
  ],
})
export class SignUpModule {
}
