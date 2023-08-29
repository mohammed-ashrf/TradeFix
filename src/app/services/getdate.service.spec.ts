import { TestBed } from '@angular/core/testing';

import { GetdateService } from './getdate.service';

describe('GetdateService', () => {
  let service: GetdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
