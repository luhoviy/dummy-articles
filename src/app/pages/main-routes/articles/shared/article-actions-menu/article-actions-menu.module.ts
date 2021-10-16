import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleActionsMenuComponent } from './article-actions-menu.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { ConfirmationDialogModule } from '../../../../../shared/components/confirmation-dialog/confirmation-dialog.module';

@NgModule({
  declarations: [ArticleActionsMenuComponent],
  exports: [ArticleActionsMenuComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    RouterModule,
    ConfirmationDialogModule,
  ],
})
export class ArticleActionsMenuModule {}
