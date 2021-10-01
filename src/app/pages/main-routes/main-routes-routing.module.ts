import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainRoutesComponent } from './main-routes.component';

const routes: Routes = [
  {
    path: '',
    component: MainRoutesComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'articles',
      },
      {
        path: 'articles',
        loadChildren: () =>
          import('./articles/articles.module').then(
            (module) => module.ArticlesModule
          ),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./profile/profile.module').then(
            (module) => module.ProfileModule
          ),
      },
      {
        path: '**',
        redirectTo: 'articles',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutesRoutingModule {}
