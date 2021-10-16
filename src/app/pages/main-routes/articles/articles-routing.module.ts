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
        path: 'new',
        pathMatch: 'full',
        loadChildren: () =>
          import('./article-editor/article-editor.module').then(
            (module) => module.ArticleEditorModule
          ),
        data: {
          isCreateMode: true,
        },
      },
      {
        path: ':id/edit',
        pathMatch: 'full',
        loadChildren: () =>
          import('./article-editor/article-editor.module').then(
            (module) => module.ArticleEditorModule
          ),
        data: {
          isEditMode: true,
        },
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
