import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { characterGuardGuard } from './character-guard.guard';

describe('characterGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => characterGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
