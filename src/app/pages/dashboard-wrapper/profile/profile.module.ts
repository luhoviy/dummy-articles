import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { SharedModule } from '../../../shared/shared.module';
import { ProfileInfoComponent } from './profile-info/profile-info.component';
import { MatListModule } from '@angular/material/list';
import { PipesModule } from '../../../shared/pipes/pipes.module';
import { MatDialogModule } from '@angular/material/dialog';
import { UserInfoFormModule } from '../../../shared/components/user-info-form/user-info-form.module';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [ProfileComponent, ProfileInfoComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ProfileComponent,
      },
    ]),
    MatTabsModule,
    SharedModule,
    MatListModule,
    PipesModule,
    MatDialogModule,
    UserInfoFormModule,
    MatTooltipModule,
  ],
})
export class ProfileModule {}
