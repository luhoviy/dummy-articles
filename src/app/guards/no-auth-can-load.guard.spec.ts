import { TestBed } from '@angular/core/testing';

import { NoAuthCanLoadGuard } from './no-auth-can-load.guard';
import { MockStore } from '@ngrx/store/testing';
import * as fromAuthFeature from '../authentication/store';
import { Store } from '@ngrx/store';
import { TestModule } from '../test-utils/test.module';

describe('NoAuthCanLoadGuard', () => {
  let guard: NoAuthCanLoadGuard;
  let store: MockStore<fromAuthFeature.AuthState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
      providers: [NoAuthCanLoadGuard],
    });
    guard = TestBed.inject(NoAuthCanLoadGuard);
    store = TestBed.get(Store);
    store.overrideSelector(fromAuthFeature.getIsInitialAuthState, false);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should not load component and redirect to dashboard page if user is logged in', () => {
    store.overrideSelector(fromAuthFeature.getIsLoggedIn, true);
    // @ts-ignore
    spyOn(guard.router, 'navigate');
    guard.canLoad(null, []).subscribe();
    // @ts-ignore
    expect(guard.router.navigate).toHaveBeenCalledWith(['display/articles']);
  });

  it('should return true and load component is logged out', (done) => {
    store.overrideSelector(fromAuthFeature.getIsLoggedIn, false);
    // @ts-ignore
    spyOn(guard.router, 'navigate');
    guard.canLoad(null, []).subscribe((canLoad) => {
      expect(canLoad).toBeTruthy();
      // @ts-ignore
      expect(guard.router.navigate).not.toHaveBeenCalled();
      done();
    });
  });
});
