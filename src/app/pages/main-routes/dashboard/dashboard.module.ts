import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { WidgetsModule } from './widgets/widgets.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SharedModule } from '../../../shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: DashboardComponent,
      },
    ]),
    HttpClientModule,
    WidgetsModule,
    MatSidenavModule,
    SharedModule,
  ],
})
export class DashboardModule {}
