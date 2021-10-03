import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleEditorComponent } from './article-editor.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from '../../../../shared/shared.module';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { FileUploaderModule } from '../../../../shared/components/file-uploader/file-uploader.module';
import { RouterModule } from '@angular/router';
import { ArticleResolver } from '../shared/article.resolver';
import { HumanizedTimePipe } from '../../../../shared/pipes/humanized-time/humanized-time.pipe';

@NgModule({
  declarations: [ArticleEditorComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ArticleEditorComponent,
        resolve: {
          article: ArticleResolver,
        },
      },
    ]),
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    SharedModule,
    MatSelectModule,
    MatOptionModule,
    MatRadioModule,
    FileUploaderModule,
  ],
  providers: [HumanizedTimePipe],
})
export class ArticleEditorModule {}
