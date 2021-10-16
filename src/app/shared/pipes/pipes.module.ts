import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAgePipe } from './user-age/user-age.pipe';
import { FillEmptyPipe } from './fill-empty/fill-empty.pipe';
import { HumanizedTimePipe } from './humanized-time/humanized-time.pipe';

@NgModule({
  declarations: [UserAgePipe, FillEmptyPipe, HumanizedTimePipe],
  exports: [UserAgePipe, FillEmptyPipe, HumanizedTimePipe],
  imports: [CommonModule],
})
export class PipesModule {}
