import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardWrapperRoutingModule } from './dashboard-wrapper-routing.module';
import { DashboardWrapperComponent } from './dashboard-wrapper.component';
import { SharedModule } from '../../shared/shared.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { LayoutModule } from '@angular/cdk/layout';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';

@NgModule({
  declarations: [DashboardWrapperComponent],
  imports: [
    CommonModule,
    DashboardWrapperRoutingModule,
    SharedModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    LayoutModule,
    AngularFireStorageModule,
  ],
})
export class DashboardWrapperModule {}
