import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { AuthLayoutModule } from '../../shared/components/auth-layout/auth-layout.module';

@NgModule({
  declarations: [LoginComponent],
  imports: [CommonModule, AuthLayoutModule],
  exports: [LoginComponent],
})
export class LoginModule {}
