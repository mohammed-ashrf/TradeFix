import { TestBed } from '@angular/core/testing';

import { DisableRightClickService } from './disable-right-click.service';

describe('DisableRightClickService', () => {
  let service: DisableRightClickService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DisableRightClickService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
