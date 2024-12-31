import { TestBed } from '@angular/core/testing';

import { TaskEndpoint } from '../endpoints';
import { TaskService } from './task.service';
import { UtilityService } from './utility.service';

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    let taskEndpointMock = {} as jest.Mocked<TaskEndpoint>;
    let utilityServiceMock = {} as jest.Mocked<UtilityService>;
    service = new TaskService(taskEndpointMock, utilityServiceMock);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
