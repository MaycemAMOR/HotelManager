import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { hotelDetailGuard } from './hotel-detail.guard';

describe('hotelDetailGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => hotelDetailGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
