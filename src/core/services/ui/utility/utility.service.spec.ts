import { TestBed } from '@angular/core/testing';

import { EStatus } from '../../../models/task.model';
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
    expect(service.getEnumKeyFromValue(EStatus, 'PENDING', EStatus.NO_STATUS)).toBe(
      EStatus.PENDING
    );
  });

  it('should return default value when key not found', () => {
    expect(service.getEnumKeyFromValue(EStatus, 'NOTFOUND', EStatus.NO_STATUS)).toBe(
      EStatus.NO_STATUS
    );
  });
});
