import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticlesRoutingModule } from './articles-routing.module';
import { ArticlesComponent } from './articles.component';
import { WidgetsModule } from './widgets/widgets.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SharedModule } from '../../../shared/shared.module';
import { Store, StoreModule } from '@ngrx/store';
import { ArticlesReducerFactory } from './store/reducers';
import { EffectsModule } from '@ngrx/effects';
import { ArticlesEffects } from './store/effects/effects';
import { getCurrentUser } from '../../../authentication/store';
import { filter, take } from 'rxjs/operators';
import { getUserSearchConfigFromLocaleStorage } from '../../../shared/utils';
import { updateSearchConfig } from './store';

@NgModule({
  declarations: [ArticlesComponent],
  imports: [
    CommonModule,
    ArticlesRoutingModule,
    WidgetsModule,
    MatSidenavModule,
    SharedModule,
    StoreModule.forFeature('articles', ArticlesReducerFactory),
    EffectsModule.forFeature([ArticlesEffects]),
  ],
})
export class ArticlesModule {
  constructor(store: Store) {
    store
      .select(getCurrentUser)
      .pipe(
        take(1),
        filter((user) => !!user)
      )
      .subscribe((user) => {
        const currentUserSearchConfig = getUserSearchConfigFromLocaleStorage(
          user.id
        );
        if (!!currentUserSearchConfig) {
          store.dispatch(
            updateSearchConfig({ searchConfig: currentUserSearchConfig })
          );
        }
      });
  }
}
