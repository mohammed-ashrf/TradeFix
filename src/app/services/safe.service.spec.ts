import { TestBed } from '@angular/core/testing';

import { SafeService } from './safe.service';

describe('SafeService', () => {
  let service: SafeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SafeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
