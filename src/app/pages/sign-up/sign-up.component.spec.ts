import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignUpComponent } from './sign-up.component';
import { TestModule } from '../../test-utils/test.module';
import { AuthLayoutModule } from '../../shared/components/auth-layout/auth-layout.module';
import { UserInfoFormModule } from '../../shared/components/user-info-form/user-info-form.module';
import { signUpWithEmail } from '../../authentication/store';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignUpComponent],
      imports: [TestModule, AuthLayoutModule, UserInfoFormModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('test signUp method', () => {
    // @ts-ignore
    spyOn(component.store, 'dispatch');
    component.signUp(null);
    // @ts-ignore
    expect(component.store.dispatch).toHaveBeenCalledWith(
      signUpWithEmail({ userInfo: null })
    );
  });
});
