import { TestBed } from '@angular/core/testing';

import { NotificationsService } from './notifications.service';
import {
  MatSnackBarConfig,
  MatSnackBarModule,
} from '@angular/material/snack-bar';

describe('NotificationsService', () => {
  let service: NotificationsService;
  const message = 'test message';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatSnackBarModule],
    });
    service = TestBed.inject(NotificationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('test success method', () => {
    expect(service).toBeTruthy();
    // @ts-ignore
    spyOn(service.snackBar, 'open');
    service.success(message);
    // @ts-ignore
    expect(service.snackBar.open).toHaveBeenCalledWith(
      message,
      undefined,
      service.config
    );
  });

  it('test error method', () => {
    expect(service).toBeTruthy();
    // @ts-ignore
    spyOn(service.snackBar, 'open');
    service.error(message);
    // @ts-ignore
    expect(service.snackBar.open).toHaveBeenCalledWith(
      message,
      undefined,
      service.config
    );
  });

  it('test notification method', () => {
    expect(service).toBeTruthy();
    // @ts-ignore
    spyOn(service.snackBar, 'open');
    service.notification(message);
    // @ts-ignore
    expect(service.snackBar.open).toHaveBeenCalledWith(
      message,
      undefined,
      service.config
    );
  });

  it('test setConfig method', () => {
    const expectedResult: MatSnackBarConfig = {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 3000,
      panelClass: 'success-snackbar',
    };
    // @ts-ignore
    service.setConfig(3, 'success-snackbar');
    expect(service.config).toEqual(expectedResult);
  });
});
