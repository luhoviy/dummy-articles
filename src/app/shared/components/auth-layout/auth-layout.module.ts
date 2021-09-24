import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthLayoutComponent } from './auth-layout.component';
import { SharedModule } from '../../shared.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { AuthProvidersComponent } from './auth-providers/auth-providers.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AuthLayoutComponent, AuthProvidersComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  exports: [
    AuthLayoutComponent,
    AuthProvidersComponent,
    ReactiveFormsModule,
    SharedModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class AuthLayoutModule {}
