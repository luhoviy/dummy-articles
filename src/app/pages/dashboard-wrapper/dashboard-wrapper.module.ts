import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardWrapperRoutingModule } from './dashboard-wrapper-routing.module';
import { DashboardWrapperComponent } from './dashboard-wrapper.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [DashboardWrapperComponent],
  imports: [
    CommonModule,
    DashboardWrapperRoutingModule,
    MatCardModule,
    MatButtonModule,
  ],
})
export class DashboardWrapperModule {}
