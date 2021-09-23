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
import { ProfilePhotoComponent } from './profile-photo/profile-photo.component';
import { FileUploaderModule } from '../../../shared/components/file-uploader/file-uploader.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { LinkedAccountsComponent } from './linked-accounts/linked-accounts.component';

@NgModule({
  declarations: [
    ProfileComponent,
    ProfileInfoComponent,
    ProfilePhotoComponent,
    LinkedAccountsComponent,
  ],
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
    FileUploaderModule,
    MatSlideToggleModule,
  ],
})
export class ProfileModule {}
