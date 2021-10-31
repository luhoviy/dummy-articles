import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { ConfirmDialogData } from './confirmation-dialog.model';
import { SharedModule } from '../../shared.module';

describe('ConfirmationDialogComponent', () => {
  let component: ConfirmationDialogComponent;
  let fixture: ComponentFixture<ConfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule, SharedModule],
      declarations: [ConfirmationDialogComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            close: () => null,
          },
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: new ConfirmDialogData(),
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('test closeModal method', () => {
    // @ts-ignore
    spyOn(component.dialogRef, 'close');
    component.closeModal(true);
    // @ts-ignore
    expect(component.dialogRef.close).toHaveBeenCalledWith(true);
  });
});
