import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment.development';
import { EStatus, Task } from '../../models/task.model';
import { TaskApiService } from './task-api.service';

let service: TaskApiService;
let httpTesting: HttpTestingController;
let apiUrl: string;

describe('TaskApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    httpTesting = TestBed.inject(HttpTestingController);
    service = TestBed.inject(TaskApiService);
    apiUrl = environment.apiURL + 'tasks';
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all tasks by project id', () => {
    const mockTasks: Task[] = [
      new Task({
        id: 1,
        title: 'Configurer Angular',
        description: "Mettre en place l'architecture du projet",
        status: EStatus.PENDING,
        priority: 1,
        dueDate: new Date('2024-06-01'),
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      new Task({
        id: 2,
        title: 'Créer des composants',
        description: 'Créer les composants principaux pour le tableau de bord',
        status: EStatus.IN_PROGRESS,
        priority: 2,
        dueDate: new Date('2024-06-05'),
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ];

    service.fetchAllTasksByProjectId(2).subscribe(tasks => {
      expect(tasks).toEqual(mockTasks);
    });

    // Test url and request
    const req = httpTesting.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockTasks);
  });

  it('should fetch delete task', () => {
    const taskId = 123;

    service.fetchDeleteTask(taskId).subscribe({
      next: response => {
        expect(response).toBeUndefined(); // ou à adapter selon ton type de retour
      },
    });

    const req = httpTesting.expectOne(`${apiUrl}/${taskId}`);
    expect(req.request.method).toBe('DELETE');

    req.flush(null);
  });

  it('should update the status of tasks', () => {
    const modifiedTasks: Task[] = [
      new Task({
        id: 1,
        title: 'Configurer Angular',
        status: EStatus.DONE,
        priority: 1,
        dueDate: new Date('2024-06-01'),
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ];

    service.fetchUpdateTaskStatus(modifiedTasks).subscribe(tasks => {
      expect(tasks).toEqual(modifiedTasks);
    });

    // Test URL and request
    const req = httpTesting.expectOne(`${apiUrl}/status`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(modifiedTasks);
    req.flush(modifiedTasks);
  });

  it('should update a task', () => {
    const modifiedTask = new Task({
      id: 2,
      title: 'Créer des composants',
      status: EStatus.DONE,
      priority: 2,
      dueDate: new Date('2024-06-05'),
      createdAt: new Date(),
      updatedAt: new Date(),
      projectId: 1,
    });

    service.fetchUpdateTask(modifiedTask).subscribe(task => {
      expect(task).toEqual(modifiedTask);
    });

    // Test URL and request
    const req = httpTesting.expectOne(apiUrl + `/${modifiedTask.id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(modifiedTask);
    req.flush(modifiedTask);
  });

  it('should add a new task', () => {
    const newTask = new Task({
      id: 3,
      title: 'Créer un formulaire',
      status: EStatus.PENDING,
      priority: 3,
      dueDate: new Date('2024-06-10'),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    service.fetchAddNewTask(newTask).subscribe(task => {
      expect(task).toEqual(newTask);
    });

    // Test URL and request
    const req = httpTesting.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newTask);
    req.flush(newTask);
  });

  afterEach(() => {
    httpTesting.verify();
  });
});
