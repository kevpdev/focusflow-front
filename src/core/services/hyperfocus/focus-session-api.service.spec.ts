import { TestBed } from '@angular/core/testing';

import { FocusSessionApiService } from './focus-session-api.service';

describe('FocusSessionApiService', () => {
  let service: FocusSessionApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FocusSessionApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
