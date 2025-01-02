import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ETaskStatus, Task } from '../../models/task.model';
import { UtilityService } from '../utility.service';
import { TaskApiService } from './task-api.service';
import { TaskStoreService } from './task-store.service';


describe('TaskStoreService', () => {
  let service: TaskStoreService;
  let taskApiMock: jest.Mocked<TaskApiService>;
  let utilityMock: jest.Mocked<UtilityService>;
  let mockTasks: Task[];

  beforeEach(() => {
    // Mock pour TaskApiService
    taskApiMock = {
      fetchAllTasks: jest.fn().mockReturnValue(of([])),
      fetchUpdateTaskStatus: jest.fn(),
      fetchDeleteTask: jest.fn(),
      fetchAddNewTask: jest.fn(),
      fetchUpdateTask: jest.fn(),
    } as Partial<TaskApiService> as jest.Mocked<TaskApiService>;

    // Mock pour UtilityService
    utilityMock = {
      generateTempId: jest.fn().mockReturnValue('temp-id'),
    } as Partial<UtilityService> as jest.Mocked<UtilityService>;

    // Initialisation des tâches mockées
    mockTasks = [
      new Task({ id: 1, title: 'Task 1', status: ETaskStatus.PENDING }),
      new Task({ id: 2, title: 'Task 2', status: ETaskStatus.IN_PROGRESS }),
    ];

    TestBed.configureTestingModule({
      providers: [
        { provide: TaskApiService, useValue: taskApiMock },
        { provide: UtilityService, useValue: utilityMock },
        TaskStoreService,
      ],
    });

    service = TestBed.inject(TaskStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all tasks and update state', (done) => {
    taskApiMock.fetchAllTasks.mockReturnValue(of(mockTasks));

    service.fetchAllTasks().subscribe((tasks) => {
      expect(tasks).toEqual(mockTasks);
      expect(service.tasksSubject.value).toEqual(mockTasks);
      expect(taskApiMock.fetchAllTasks).toHaveBeenCalled();
      done();
    });
  });

  it('should handle error while fetching all tasks', (done) => {
    const error = new Error('API error');
    taskApiMock.fetchAllTasks.mockReturnValue(throwError(() => error));

    service.fetchAllTasks().subscribe({
      next: () => fail('Expected an error, but got a response'),
      error: (err) => {
        expect(err.message).toContain('Une erreur est survenue lors de la récupération de toutes les tâches.');
        done();
      },
    });
  });

  it('should fetch tasks by status', (done) => {
    service.tasksSubject.next(mockTasks);
    service.fetchTasksByStatus(ETaskStatus.PENDING).subscribe((tasks) => {
      expect(tasks).toEqual([mockTasks[0]]);
      done();
    });
  });

  it('should add a new task and update state', (done) => {
    const newTask = new Task({ title: 'New Task', tempId: 'temp-id' });
    const savedTask = new Task({ id: 3, title: 'New Task' });

    taskApiMock.fetchAddNewTask.mockReturnValue(of(savedTask));

    service.addNewTask(newTask).subscribe((task) => {
      console.log('TASK ADD : ', task);

      expect(task).toEqual(savedTask);
      expect(service.tasksSubject.value).toContainEqual(savedTask);
      expect(utilityMock.generateTempId).toHaveBeenCalled();
      done();
    });
  });

  it('should handle error while adding a new task', (done) => {
    const newTask = new Task({ title: 'New Task', tempId: 'temp-id' });
    const error = new Error('API error');

    taskApiMock.fetchAddNewTask.mockReturnValue(throwError(() => error));

    service.addNewTask(newTask).subscribe({
      next: () => fail('Expected an error, but got a response'),
      error: (err) => {
        expect(err.message).toContain("Une erreur est survenue lors de l'ajout de la tâches.");
        expect(service.tasksSubject.value).not.toContainEqual(newTask);
        done();
      },
    });
  });

  it('should delete a task and update state', (done) => {
    taskApiMock.fetchDeleteTask.mockReturnValue(of(void 0));
    service.tasksSubject.next(mockTasks);

    service.deleteTask(1).subscribe(() => {
      expect(service.tasksSubject.value).toEqual([mockTasks[1]]);
      expect(taskApiMock.fetchDeleteTask).toHaveBeenCalledWith(1);
      done();
    });
  });

  it('should handle error while deleting a task', (done) => {
    const error = new Error('API error');
    taskApiMock.fetchDeleteTask.mockReturnValue(throwError(() => error));
    service.tasksSubject.next(mockTasks);

    service.deleteTask(1).subscribe({
      next: () => fail('Expected an error, but got a response'),
      error: (err) => {
        expect(err.message).toContain('Une erreur est survenue lors de la suppression de la tâche.');
        expect(service.tasksSubject.value).toEqual(mockTasks); // Liste restaurée
        done();
      },
    });
  });

  it('should update task status and update state', (done) => {

    service.tasksSubject.next([new Task({ id: 1, status: ETaskStatus.IN_PROGRESS })]);
    const modifiedTasks = [new Task({ id: 1, status: ETaskStatus.DONE })];
    taskApiMock.fetchUpdateTaskStatus.mockReturnValue(of(modifiedTasks));

    console.log('updateTaskStatus : service.tasksSubject.value : ', service.tasksSubject.value);
    service.updateTaskStatus(modifiedTasks).subscribe((tasks) => {
      console.log('updateTaskStatus : taks ', tasks);


      expect(tasks).toEqual(modifiedTasks);
      //expect(service.tasksSubject.value[0].status).toBe(ETaskStatus.DONE);
      expect(taskApiMock.fetchUpdateTaskStatus).toHaveBeenCalledWith(modifiedTasks);
      done();
    });
  });

  it('should handle error while updating task status', (done) => {
    const modifiedTasks = [new Task({ id: 1, status: ETaskStatus.DONE })];
    taskApiMock.fetchUpdateTaskStatus.mockReturnValue(throwError(() => new Error()));

    service.updateTaskStatus(modifiedTasks).subscribe({
      next: () => fail('Expected an error, but got a response'),
      error: (err) => {

        expect(err.message).toBe('Une erreur est survenue lors de la modification du statut des tâches.');
        done();
      },
    });
  });
});
