import { TestBed } from '@angular/core/testing';

import { ETaskStatus } from '../models/task.model';
import { UtilityService } from './utility.service';

describe('UtilityService', () => {
  let service: UtilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return an enum key from value', () => {
    expect(service.getEnumKeyFromValue(ETaskStatus, 'PENDING', ETaskStatus.NO_STATUS))
      .toBe(ETaskStatus.PENDING);
  });

  it('should return default value when key not found', () => {
    expect(service.getEnumKeyFromValue(ETaskStatus, 'NOTFOUND', ETaskStatus.NO_STATUS))
      .toBe(ETaskStatus.NO_STATUS);
  });

});
