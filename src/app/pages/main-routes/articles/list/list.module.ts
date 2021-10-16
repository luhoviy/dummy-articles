import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ListComponent } from './list.component';
import { SharedModule } from '../../../../shared/shared.module';
import { ArticleActionsMenuModule } from '../shared/article-actions-menu/article-actions-menu.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { PipesModule } from '../../../../shared/pipes/pipes.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [ListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ListComponent,
      },
    ]),
    SharedModule,
    ArticleActionsMenuModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    PipesModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
  ],
})
export class ListModule {}
