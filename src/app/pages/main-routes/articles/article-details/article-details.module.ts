import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleDetailsComponent } from './article-details.component';
import { RouterModule } from '@angular/router';
import { ArticleResolver } from '../shared/article.resolver';

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
  ],
})
export class ArticleDetailsModule {}
