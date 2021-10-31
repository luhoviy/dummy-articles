import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { TestModule } from '../../test-utils/test.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthLayoutModule } from '../../shared/components/auth-layout/auth-layout.module';
import { loginWithEmail } from '../../authentication/store';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        TestModule,
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        AuthLayoutModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call initForm method onInit', () => {
    // @ts-ignore
    spyOn(component, 'initForm');
    component.ngOnInit();
    // @ts-ignore
    expect(component.initForm).toHaveBeenCalled();
  });

  it('test initForm method', () => {
    const initialFormValue = {
      email: '',
      password: '',
    };
    component.form = null;
    // @ts-ignore
    component.initForm();
    expect(component.form).toBeTruthy();
    expect(component.form.value).toEqual(initialFormValue);
  });

  it('test loginWithEmail method', () => {
    // @ts-ignore
    spyOn(component.store, 'dispatch');
    component.loginWithEmail();
    // @ts-ignore
    expect(component.store.dispatch).toHaveBeenCalledWith(
      loginWithEmail({ email: '', password: '' })
    );
  });
});
