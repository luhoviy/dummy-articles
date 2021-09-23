import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploaderComponent } from './file-uploader.component';
import { SharedModule } from '../../shared.module';
import { FileUploaderDirective } from './file-uploader.directive';

@NgModule({
  declarations: [FileUploaderComponent, FileUploaderDirective],
  exports: [FileUploaderComponent],
  imports: [CommonModule, SharedModule],
})
export class FileUploaderModule {}
