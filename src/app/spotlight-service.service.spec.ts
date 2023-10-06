import { TestBed } from '@angular/core/testing';

import { SpotlightServiceService } from './spotlight-service.service';

describe('SpotlightServiceService', () => {
  let service: SpotlightServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpotlightServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
