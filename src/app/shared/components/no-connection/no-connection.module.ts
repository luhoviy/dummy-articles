import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoConnectionComponent } from './no-connection.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [NoConnectionComponent],
  exports: [NoConnectionComponent],
  imports: [CommonModule, MatProgressSpinnerModule, FlexLayoutModule],
})
export class NoConnectionModule {}
