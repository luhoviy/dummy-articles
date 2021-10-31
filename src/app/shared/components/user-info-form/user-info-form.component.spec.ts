import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserInfoFormComponent } from './user-info-form.component';
import { TestModule } from '../../../test-utils/test.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

describe('UserInfoFormComponent', () => {
  let component: UserInfoFormComponent;
  let fixture: ComponentFixture<UserInfoFormComponent>;
  const initialFormValue = {
    firstName: '',
    lastName: '',
    birthDate: null,
    email: '',
    password: '',
    passwordConfirmation: '',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserInfoFormComponent],
      imports: [
        TestModule,
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserInfoFormComponent);
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

  describe('initForm method', () => {
    it('should correctly create form', () => {
      component.form = null;
      // @ts-ignore
      component.initForm();
      expect(component.form).toBeTruthy();
      expect(component.form.value).toEqual(initialFormValue);
    });

    it('email and password controls should be disabled if is editMode ', () => {
      component.isEditMode = true;
      // @ts-ignore
      component.initForm();
      expect(component.form.controls.email.disabled).toBeTruthy();
      expect(component.form.controls.password.disabled).toBeTruthy();
      expect(
        component.form.controls.passwordConfirmation.disabled
      ).toBeTruthy();
    });
  });

  it('submit method should emit form value', () => {
    spyOn(component.onSubmit, 'emit');
    component.submit();
    expect(component.onSubmit.emit).toHaveBeenCalledWith(initialFormValue);
  });
});
