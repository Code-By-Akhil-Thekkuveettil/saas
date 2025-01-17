import { TestBed } from '@angular/core/testing';

import { TrackingIdService } from './tracking-id.service';

describe('TrackingIdService', () => {
  let service: TrackingIdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrackingIdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
