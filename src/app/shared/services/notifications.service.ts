import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  config: MatSnackBarConfig = {
    horizontalPosition: 'center',
    verticalPosition: 'top'
  };

  constructor(private snackBar: MatSnackBar) {
  }

  public success(
    text: string,
    notificationDurationInSeconds = 3,
    showButton = false,
    buttonText = 'Dismiss'
  ): void {
    this.setConfig(notificationDurationInSeconds, 'error-snackbar');
    this.snackBar.open(text, showButton ? buttonText : undefined, this.config);
  }

  public error(
    text: string,
    notificationDurationInSeconds = 3,
    showButton = false,
    buttonText = 'Dismiss'
  ): void {
    this.setConfig(notificationDurationInSeconds, 'error-snackbar');
    this.snackBar.open(text, showButton ? buttonText : undefined, this.config);
  }

  public notification(
    text: string,
    notificationDurationInSeconds = 3,
    showButton = false,
    buttonText = 'Dismiss'
  ): void {
    this.setConfig(notificationDurationInSeconds, 'notification-snackbar');
    this.snackBar.open(text, showButton ? buttonText : undefined, this.config);
  }

  private setConfig(
    durationInSeconds: number,
    panelClass: 'success-snackbar' | 'error-snackbar' | 'notification-snackbar'
  ): void {
    this.config.duration = durationInSeconds * 1000;
    this.config.panelClass = panelClass;
  }
}
