import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { User } from '../../../authentication/shared/auth.model';
import { Store } from '@ngrx/store';
import * as fromAuthFeature from '../../../authentication/store';
import { ClearObservable } from '../../../shared/components/clear-observable.component';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProfileComponent extends ClearObservable implements OnInit {
  user: User;
  selectedTabIndex: number = 0;

  constructor(private store: Store) {
    super();
  }

  ngOnInit(): void {
    this.store
      .select(fromAuthFeature.getCurrentUser)
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => (this.user = user));
  }
}
