import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditComponent } from './edit.component';
import { RouterModule } from '@angular/router';
import { ArticleResolver } from '../shared/article.resolver';

@NgModule({
  declarations: [EditComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: EditComponent,
        resolve: {
          article: ArticleResolver,
        },
      },
    ]),
  ],
})
export class EditModule {}
