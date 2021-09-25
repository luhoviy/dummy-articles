import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AngularFireAuthGuard, redirectLoggedInTo, redirectUnauthorizedTo, } from '@angular/fire/compat/auth-guard';
import { NoAuthCanLoadGuard } from './guards/no-auth-can-load.guard';
import { AuthCanLoadGuard } from './guards/auth-can-load.guard';

const redirectLoggedInToDashboard = () =>
  redirectLoggedInTo(['display/dashboard']);
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectLoggedInToDashboard },
  },
  {
    path: 'sign-up',
    loadChildren: () =>
      import('./pages/sign-up/sign-up.module').then((m) => m.SignUpModule),
    canLoad: [NoAuthCanLoadGuard],
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectLoggedInToDashboard },
  },
  {
    path: 'password-recovery',
    loadChildren: () =>
      import('./pages/password-recovery/password-recovery.module').then(
        (m) => m.PasswordRecoveryModule
      )
  },
  {
    path: 'display',
    loadChildren: () =>
      import('./pages/main-routes/main-routes.module').then(
        (module) => module.MainRoutesModule
      ),
    canActivate: [AngularFireAuthGuard],
    canLoad: [AuthCanLoadGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [NoAuthCanLoadGuard, AuthCanLoadGuard],
})
export class AppRoutingModule {}
