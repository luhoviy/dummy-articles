import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ClearObservable } from './components/clear-observable.component';
import { ImageFadeInDirective } from './directives/image-fade-in.directive';
import { StopPropagationDirective } from './directives/stop-propagation.directive';
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";

@NgModule({
  declarations: [
    ClearObservable,
    ImageFadeInDirective,
    StopPropagationDirective,
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
  ],
  exports: [
    ImageFadeInDirective,
    StopPropagationDirective,
    FlexLayoutModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
  ],
})
export class SharedModule {
}
