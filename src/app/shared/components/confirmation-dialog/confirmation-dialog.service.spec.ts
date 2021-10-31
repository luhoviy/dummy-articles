import { TestBed } from '@angular/core/testing';

import { ConfirmationDialogService } from './confirmation-dialog.service';
import { ConfirmationDialogModule } from './confirmation-dialog.module';
import { MatDialogConfig } from '@angular/material/dialog';
import { ConfirmDialogData } from './confirmation-dialog.model';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { of } from 'rxjs';

describe('ConfirmationDialogService', () => {
  let service: ConfirmationDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ConfirmationDialogModule],
    });
    service = TestBed.inject(ConfirmationDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('test open method', () => {
    const dialogConfig: MatDialogConfig = {
      autoFocus: false,
      data: new ConfirmDialogData(),
      width: 'fit-content',
      maxWidth: '90vw',
    };
    // @ts-ignore
    spyOn(service.dialog, 'open').and.returnValue({
      afterClosed: () => of(null),
    });
    service.open();
    // @ts-ignore
    expect(service.dialog.open).toHaveBeenCalledWith(
      ConfirmationDialogComponent,
      dialogConfig
    );
  });
});
