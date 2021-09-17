import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { ConfirmationDialogService } from "./confirmation-dialog.service";
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from "../../shared.module";


@NgModule({
  declarations: [
    ConfirmationDialogComponent,
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    SharedModule
  ],
  providers: [
    ConfirmationDialogService
  ]
})
export class ConfirmationDialogModule { }
