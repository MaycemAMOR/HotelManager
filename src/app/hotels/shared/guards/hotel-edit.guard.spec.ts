import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';

import { hotelEditGuard } from './hotel-edit.guard';

describe('hotelEditGuard', () => {
  const executeGuard: CanDeactivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => hotelEditGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
