import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetsComponent } from './widgets.component';
import { WidgetsService } from './widgets.service';
import { StoreModule } from '@ngrx/store';
import { widgetsReducerFactory } from './store/reducers';
import { EffectsModule } from '@ngrx/effects';
import { Effects } from './store/effects/effects';
import { SharedModule } from '../../../../shared/shared.module';
import { PipesModule } from '../../../../shared/pipes/pipes.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [WidgetsComponent],
  imports: [
    CommonModule,
    StoreModule.forFeature('widgets', widgetsReducerFactory),
    EffectsModule.forFeature([Effects]),
    SharedModule,
    PipesModule,
    MatTooltipModule,
    HttpClientModule,
  ],
  exports: [WidgetsComponent],
  providers: [WidgetsService],
})
export class WidgetsModule {}
