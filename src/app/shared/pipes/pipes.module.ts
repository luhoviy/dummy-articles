import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAgePipe } from './user-age.pipe';
import { FillEmptyPipe } from './fill-empty.pipe';

@NgModule({
  declarations: [UserAgePipe, FillEmptyPipe],
  exports: [FillEmptyPipe],
  imports: [CommonModule],
})
export class PipesModule {}
