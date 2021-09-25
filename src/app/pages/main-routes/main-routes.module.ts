import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainRoutesRoutingModule } from './main-routes-routing.module';
import { MainRoutesComponent } from './main-routes.component';
import { SharedModule } from '../../shared/shared.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { LayoutModule } from '@angular/cdk/layout';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';

@NgModule({
  declarations: [MainRoutesComponent],
  imports: [
    CommonModule,
    MainRoutesRoutingModule,
    SharedModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    LayoutModule,
    AngularFireStorageModule,
  ],
})
export class MainRoutesModule {
}
