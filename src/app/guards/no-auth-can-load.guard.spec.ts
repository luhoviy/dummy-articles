import { TestBed } from '@angular/core/testing';

import { NoAuthCanLoadGuard } from './no-auth-can-load.guard';

describe('NoAuthCanLoadGuard', () => {
  let guard: NoAuthCanLoadGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(NoAuthCanLoadGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
