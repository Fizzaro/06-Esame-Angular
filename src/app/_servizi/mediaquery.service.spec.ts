import { TestBed } from '@angular/core/testing';

import { MediaqueryService } from './mediaquery.service';

describe('MediaqueryService', () => {
  let service: MediaqueryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MediaqueryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
