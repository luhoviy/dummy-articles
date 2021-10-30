import { TestBed } from '@angular/core/testing';
import * as fromAuthFeature from '../authentication/store';
import { AuthCanLoadGuard } from './auth-can-load.guard';
import { MockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { TestModule } from '../test-utils/test.module';

describe('AuthCanLoadGuard', () => {
  let guard: AuthCanLoadGuard;
  let store: MockStore<fromAuthFeature.AuthState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
      providers: [AuthCanLoadGuard],
    });
    guard = TestBed.inject(AuthCanLoadGuard);
    store = TestBed.get(Store);
    store.overrideSelector(fromAuthFeature.getIsInitialAuthState, false);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should not load component and redirect to login page if user is not logged in', () => {
    store.overrideSelector(fromAuthFeature.getIsLoggedIn, false);
    // @ts-ignore
    spyOn(guard.router, 'navigate');
    guard.canLoad(null, []).subscribe();
    // @ts-ignore
    expect(guard.router.navigate).toHaveBeenCalledWith(['login']);
  });

  it('should return true and load component is logged in', (done) => {
    store.overrideSelector(fromAuthFeature.getIsLoggedIn, true);
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
