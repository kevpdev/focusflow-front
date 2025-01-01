import { TestBed } from '@angular/core/testing';

import { TaskEndpoint } from '../../endpoints';
import { UtilityService } from '../utility.service';
import { TaskStoreService } from './task-store.service';

describe('TaskService', () => {
  let service: TaskStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    let taskEndpointMock = {} as jest.Mocked<TaskEndpoint>;
    let utilityServiceMock = {} as jest.Mocked<UtilityService>;
    service = new TaskStoreService(taskEndpointMock, utilityServiceMock);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
