import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewPasswordFormComponent } from './new-password-form.component';
import { TestModule } from '../../../test-utils/test.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Actions } from '@ngrx/effects';
import { of } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SimpleChanges } from '@angular/core';
import { has } from 'lodash';
import { changeUserPasswordSuccess } from '../../../authentication/store';

describe('NewPasswordFormComponent', () => {
  let component: NewPasswordFormComponent;
  let fixture: ComponentFixture<NewPasswordFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewPasswordFormComponent],
      imports: [
        TestModule,
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
      ],
      providers: [
        {
          provide: Actions,
          useValue: of(changeUserPasswordSuccess()),
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPasswordFormComponent);
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

  it('should call initForm and reset to initial state on askOldPassword @Input change', () => {
    component.askOldPassword = true;
    const changes: any = { askOldPassword: { firstChange: false } };
    // @ts-ignore
    spyOn(component, 'initForm');
    spyOn(component.formDirective, 'resetForm');
    component.ngOnChanges(changes as SimpleChanges);
    // @ts-ignore
    expect(component.initForm).toHaveBeenCalled();
    expect(component.formDirective.resetForm).toHaveBeenCalled();
  });

  describe('initForm method', () => {
    it('should correctly create form', () => {
      component.form = null;
      const initialFormValue = {
        newPassword: '',
        newPasswordConfirmation: '',
      };
      // @ts-ignore
      component.initForm();
      expect(component.form).toBeTruthy();
      expect(component.form.value).toEqual(initialFormValue);
    });

    it('form should contain oldPassword control if askOldPassword is true', () => {
      component.askOldPassword = true;
      // @ts-ignore
      component.initForm();
      fixture.detectChanges();
      expect(has(component.form.controls, 'oldPassword')).toBeTruthy();
      const componentElement = fixture.debugElement.nativeElement;
      const oldPasswordInput = componentElement.querySelector(
        'input[name="oldPassword"]'
      );
      expect(oldPasswordInput).toBeTruthy();
    });

    it('form should not contain oldPassword control if askOldPassword is false', () => {
      // @ts-ignore
      component.initForm();
      fixture.detectChanges();
      expect(has(component.form.controls, 'oldPassword')).toBeFalsy();
      const componentElement = fixture.debugElement.nativeElement;
      const oldPasswordInput = componentElement.querySelector(
        'input[name="oldPassword"]'
      );
      expect(oldPasswordInput).toBeFalsy();
    });
  });
});
