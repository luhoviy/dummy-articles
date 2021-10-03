import { Component, Input } from '@angular/core';
import { Article } from '../models';
import { ArticlesService } from '../articles.service';
import { ConfirmDialogData } from '../../../../../shared/components/confirmation-dialog/confirmation-dialog.model';
import { ConfirmationDialogService } from '../../../../../shared/components/confirmation-dialog/confirmation-dialog.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NotificationsService } from '../../../../../shared/services/notifications.service';
import { ParseFirebaseErrorMessage } from '../../../../../shared/utils';

@Component({
  selector: 'app-article-actions-menu',
  templateUrl: './article-actions-menu.component.html',
  styleUrls: ['./article-actions-menu.component.scss'],
})
export class ArticleActionsMenuComponent {
  @Input() article: Article;
  @Input() showVerticalIcon: boolean = true;
  @Input() redirectOnDelete: boolean = true;

  constructor(
    public articlesService: ArticlesService,
    private confirmDialog: ConfirmationDialogService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private notifications: NotificationsService
  ) {}

  async deleteArticle() {
    const config = new ConfirmDialogData();
    config.title = 'Are you sure you want to delete this article?';
    config.cancelButtonColor = 'primary';
    config.confirmButtonColor = 'warn';
    const confirmed = await this.confirmDialog.open(config).toPromise();
    if (confirmed) {
      await this.spinner.show();
      this.articlesService
        .deleteArticle(this.article.id)
        .pipe(
          finalize(() => this.spinner.hide()),
          take(1)
        )
        .subscribe(
          () => {
            this.notifications.success(
              'Article has been successfully deleted!'
            );
            if (this.redirectOnDelete)
              this.router.navigate(['/display/articles']);
          },
          (error) => this.notifications.error(ParseFirebaseErrorMessage(error))
        );
    }
  }
}
