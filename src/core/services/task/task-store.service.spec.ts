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
    taskApiMock = taskApiMock = {
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
      expect(service.getTasks()).toEqual(mockTasks);
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
    service.setTasksForTest(mockTasks);
    service.fetchTasksByStatus(ETaskStatus.PENDING).subscribe((tasks) => {
      expect(tasks).toEqual([mockTasks[0]]);
      done();
    });
  });

  it('should handle error while fetch tasks by status', (done) => {
    jest.spyOn(service, 'tasks$', 'get').mockReturnValue(throwError(() => new Error()));

    service.fetchTasksByStatus(ETaskStatus.PENDING).subscribe({
      next: () => fail('Expected an error, but got a response'),
      error: err => {
        expect(err.message).toBe('Une erreur est survenue lors de la récupération des tâches ' + ETaskStatus.PENDING);
        done();
      }
    });
  });

  it('should add a new task and update state', (done) => {
    const newTask = new Task({ title: 'New Task', tempId: 'temp-id' });
    const savedTask = new Task({ id: 3, title: 'New Task' });

    taskApiMock.fetchAddNewTask.mockReturnValue(of(savedTask));

    service.addNewTask(newTask).subscribe((task) => {
      expect(task).toEqual(savedTask);
      expect(service.getTaskById(3)).toEqual(savedTask);
      expect(newTask.tempId).toContain('temp-');
      expect(utilityMock.generateTempId).toHaveBeenCalled();
      expect(taskApiMock.fetchAddNewTask).toHaveBeenCalledWith(newTask);
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
        expect(service.getTasks()).not.toContainEqual(newTask);
        expect(taskApiMock.fetchAddNewTask).toHaveBeenCalledWith(newTask);
        done();
      },
    });
  });

  it('should delete a task and update state', (done) => {
    taskApiMock.fetchDeleteTask.mockReturnValue(of(void 0));
    service.setTasksForTest(mockTasks);

    service.deleteTask(1).subscribe(() => {
      expect(service.getTasks()).toEqual([mockTasks[1]]);
      expect(taskApiMock.fetchDeleteTask).toHaveBeenCalledWith(1);
      done();
    });
  });

  it('should handle error while deleting a task', (done) => {
    const error = new Error('API error');
    taskApiMock.fetchDeleteTask.mockReturnValue(throwError(() => error));
    service.setTasksForTest(mockTasks);

    service.deleteTask(1).subscribe({
      next: () => fail('Expected an error, but got a response'),
      error: (err) => {
        expect(err.message).toContain('Une erreur est survenue lors de la suppression de la tâche.');
        expect(service.getTasks()).toEqual(mockTasks); // Liste restaurée
        done();
      },
    });
  });

  it('should update task and update state', (done) => {

    service.setTasksForTest([new Task({ id: 1, status: ETaskStatus.IN_PROGRESS })]);
    const modifiedTask = new Task({ id: 1, status: ETaskStatus.DONE });

    taskApiMock.fetchUpdateTask.mockReturnValue(of(modifiedTask));

    service.updateTask(modifiedTask).subscribe((task) => {
      expect(task).toEqual(modifiedTask);
      expect(service.getTasks()[0].status).toBe(ETaskStatus.DONE);
      expect(taskApiMock.fetchUpdateTask).toHaveBeenCalledWith(modifiedTask);
      done();
    });
  });

  it('should handle error while updating task', (done) => {
    service.setTasksForTest([new Task({ id: 1, status: ETaskStatus.IN_PROGRESS })]);
    const modifiedTask = new Task({ id: 1, status: ETaskStatus.DONE });

    taskApiMock.fetchUpdateTask.mockReturnValue(throwError(() => new Error()));

    service.updateTask(modifiedTask).subscribe({
      next: () => fail('Expected an error, but got a response'),
      error: (err) => {
        expect(err.message).toBe('Une erreur est survenue lors de la modification de la tâche.');
        //Rollback test
        expect(service.getTaskById(1).status).toBe(ETaskStatus.IN_PROGRESS);
        expect(taskApiMock.fetchUpdateTask).toHaveBeenCalledWith(modifiedTask);
        done();
      },
    });
  });


  it('should handle error while updating task with empty store tasks array', (done) => {

    const modifiedTask = new Task({ id: 1, status: ETaskStatus.DONE });
    taskApiMock.fetchUpdateTask.mockReturnValue(throwError(() => new Error()));

    service.updateTask(modifiedTask).subscribe({
      next: () => fail('Expected an error, but got a response'),
      error: (err) => {
        expect(err.message).toBe("La tâche est introuvable dans le store.");
        done();
      },
    });
  });

  it('should update task status and update state', (done) => {

    service.setTasksForTest([new Task({ id: 1, status: ETaskStatus.IN_PROGRESS })]);
    const modifiedTasks = [new Task({ id: 1, status: ETaskStatus.DONE })];
    taskApiMock.fetchUpdateTaskStatus.mockReturnValue(of(modifiedTasks));

    service.updateTaskStatus(modifiedTasks).subscribe((tasks) => {
      expect(tasks).toEqual(modifiedTasks);
      expect(service.getTasks()[0].status).toBe(ETaskStatus.DONE);
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

  it('should get task by id', () => {

    service.setTasksForTest([new Task({ id: 1, status: ETaskStatus.IN_PROGRESS })]);
    const task = service.getTaskById(1);
    expect(task.id).toBe(1);

  });

  it('should handle error while get task by id', () => {
    expect(() => service.getTaskById(1)).toThrow('La tâche est introuvable.');
  });

});
