import { ThemePalette } from '@angular/material/core';

export class ConfirmDialogData {
  title: string = 'Are you sure?';
  description: string = null;
  cancelButtonText: string = 'Cancel';
  confirmButtonText: string = 'Confirm';
  cancelButtonColor: ThemePalette = 'warn';
  confirmButtonColor: ThemePalette = 'primary';
}
