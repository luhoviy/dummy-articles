import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticlesComponent } from './articles.component';

const routes: Routes = [
  {
    path: '',
    component: ArticlesComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadChildren: () =>
          import('./list/list.module').then((module) => module.ListModule),
      },
      {
        path: 'create',
        loadChildren: () =>
          import('./create/create.module').then(
            (module) => module.CreateModule
          ),
      },
      {
        path: ':id',
        pathMatch: 'full',
        loadChildren: () =>
          import('./article-details/article-details.module').then(
            (module) => module.ArticleDetailsModule
          ),
      },
      {
        path: ':id/edit',
        pathMatch: 'full',
        loadChildren: () =>
          import('./edit/edit.module').then((module) => module.EditModule),
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ArticlesRoutingModule {}
