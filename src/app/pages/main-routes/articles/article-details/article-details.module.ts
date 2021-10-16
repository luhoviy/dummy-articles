import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleDetailsComponent } from './article-details.component';
import { RouterModule } from '@angular/router';
import { ArticleResolver } from '../shared/article.resolver';
import { SharedModule } from '../../../../shared/shared.module';
import { PipesModule } from '../../../../shared/pipes/pipes.module';
import { ArticleActionsMenuModule } from '../shared/article-actions-menu/article-actions-menu.module';

@NgModule({
  declarations: [ArticleDetailsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ArticleDetailsComponent,
        resolve: {
          article: ArticleResolver,
        },
      },
    ]),
    SharedModule,
    PipesModule,
    ArticleActionsMenuModule,
  ],
})
export class ArticleDetailsModule {}
