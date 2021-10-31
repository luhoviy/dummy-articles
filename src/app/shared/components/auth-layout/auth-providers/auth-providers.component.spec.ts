import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthProvidersComponent } from './auth-providers.component';
import { TestModule } from '../../../../test-utils/test.module';
import { MockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { getIsNetworkOnline } from '../../../../store/selectors/app.selectors';
import { AuthProviderType } from '../../../../authentication/shared/auth.model';
import { loginWithProvider } from '../../../../authentication/store';

describe('AuthProvidersComponent', () => {
  let component: AuthProvidersComponent;
  let fixture: ComponentFixture<AuthProvidersComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestModule],
      declarations: [AuthProvidersComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthProvidersComponent);
    component = fixture.componentInstance;
    store = TestBed.get(Store);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set network state onInit', () => {
    store.overrideSelector(getIsNetworkOnline, false);
    component.ngOnInit();
    expect(component.isNetworkOnline).toBeFalse();
  });

  it('test loginWithProvider method', () => {
    // @ts-ignore
    spyOn(component.store, 'dispatch');
    component.loginWithProvider(AuthProviderType.GOOGLE);
    // @ts-ignore
    expect(component.store.dispatch).toHaveBeenCalledWith(
      loginWithProvider({ providerType: AuthProviderType.GOOGLE })
    );
  });
});
