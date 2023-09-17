import { TestBed } from '@angular/core/testing';

import { LossesService } from './losses.service';

describe('LossesService', () => {
  let service: LossesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LossesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
