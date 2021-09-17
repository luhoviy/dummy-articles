import { Injectable } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { ConfirmationDialogComponent } from "./confirmation-dialog.component";
import { take } from "rxjs/operators";
import { ConfirmDialogData } from "./confirmation-dialog.model";
import { Observable } from "rxjs";

@Injectable()
export class ConfirmationDialogService {

  constructor(private dialog: MatDialog) { }

  public open(config: ConfirmDialogData = new ConfirmDialogData()): Observable<boolean> {
    return this.dialog.open(ConfirmationDialogComponent, {
      autoFocus: false,
      data: config,
      width: 'fit-content',
      maxWidth: '90vw'
    }).afterClosed().pipe(take(1))
  }
}
