import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, tap, throwError } from 'rxjs';
import { EStatus } from 'src/core/models';
import { ITaskStoreService } from '../../models/interfaces/itask-store-service.interface';
import { Task } from '../../models/task.model';
import { UtilityService } from '../ui/utility/utility.service';
import { mockTasksProject } from './mock-data.mock';

@Injectable({
  providedIn: 'root',
})
export class TaskStoreServiceMock implements ITaskStoreService {
  private tasksSubject = new BehaviorSubject<Task[]>([]);

  // public observables for components
  readonly tasks$ = this.tasksSubject
    .asObservable()
    .pipe(tap(tasks => console.log('tasks', tasks)));

  public pendingTasks$: Observable<Task[]> = this.tasks$.pipe(
    map(tasks => tasks.filter(task => task.status === EStatus.PENDING))
  );

  public inProgressTasks$: Observable<Task[]> = this.tasks$.pipe(
    map(tasks => tasks.filter(task => task.status === EStatus.IN_PROGRESS))
  );

  public doneTasks$: Observable<Task[]> = this.tasks$.pipe(
    map(tasks => tasks.filter(task => task.status === EStatus.DONE))
  );

  private readonly mockTasks: Task[] = mockTasksProject;

  constructor(private utilityService: UtilityService) {}

  /**
   * Retrieves the current state of the task list in the subject.
   * @returns An array of tasks.
   */
  private currentTasks(): Task[] {
    return this.tasksSubject.getValue();
  }

  /**
   * Retrieves a task by its ID.
   * @param id Task ID.
   * @returns The task matching the ID.
   */
  public getTaskById(id: number): Task {
    const index = this.currentTasks().findIndex(task => task.id === id);

    if (!index) {
      const errorMessage = 'Task not found';
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    return this.currentTasks()[index];
  }

  /**
   * Retrieves all tasks.
   * @returns An observable emitting the list of all tasks.
   */
  public fetchAllTasksByProjectId(id: number): Observable<Task[]> {
    //console.log('Mock: Fetching all tasks');
    console.log('mockTasks', this.mockTasks);

    this.tasksSubject.next(this.mockTasks.filter(task => task.projectId === id));
    return this.tasks$;
  }

  /**
   * Retrieves all tasks filtered by their status.
   * @param status The status to filter tasks by.
   * @returns An observable emitting the filtered tasks.
   */
  public fetchTasksByStatus(status: EStatus): Observable<Task[]> {
    //console.log(`Mock: Fetching tasks with status ${status}`);
    return this.tasks$.pipe(map(tasks => tasks.filter(task => task.status === status)));
  }

  /**
   * Retrieves all pending tasks.
   * @returns An observable emitting tasks with the `PENDING` status.
   */
  public fetchAllPendingTasks(): Observable<Task[]> {
    return this.fetchTasksByStatus(EStatus.PENDING);
  }

  /**
   * Retrieves all tasks in progress.
   * @returns An observable emitting tasks with the `IN_PROGRESS` status.
   */
  public fetchAllInProgressTasks(): Observable<Task[]> {
    return this.fetchTasksByStatus(EStatus.IN_PROGRESS);
  }

  /**
   * Retrieves all finished tasks.
   * @returns An observable emitting tasks with the `DONE` status.
   */
  public fetchFinishedTasks(): Observable<Task[]> {
    return this.fetchTasksByStatus(EStatus.DONE);
  }

  /**
   * Updates an existing task.
   * @param updatedTask The task with updated details.
   * @returns An observable emitting the updated task.
   */
  public updateTask(updatedTask: Task): Observable<Task> {
    //console.log("Mock: Updating a task");
    const currentTasks = this.currentTasks();
    const taskIndex = currentTasks.findIndex(task => task.id === updatedTask.id);

    if (taskIndex !== -1) {
      currentTasks[taskIndex] = updatedTask;
      this.tasksSubject.next(currentTasks);
      return of(updatedTask);
    } else {
      console.error('Task not found in taskSubject');
      return this.handleError(null, 'Task not found');
    }
  }

  updateTaskStatus(task: Task, newStatus: EStatus): Observable<Task> {
    const currentTask = this.currentTasks().find(currentTask => currentTask.id === task.id);
    if (!currentTask) {
      console.error('Task not found in taskSubject');
      throw new Error('Task not found');
    }
    const updatedTask = { ...currentTask, status: newStatus };

    //maj store
    this.tasksSubject.next(
      this.currentTasks().map(task => (task.id === updatedTask.id ? updatedTask : task))
    );

    return of(updatedTask);
  }

  /**
   * Adds a new task.
   * @param newTask The new task to add.
   * @returns An observable emitting the newly added task.
   */
  public addNewTask(newTask: Task): Observable<Task> {
    const generatedTempId = this.utilityService.generateTempId();
    const taskWithGeneratedId = { ...newTask, tempId: generatedTempId };
    const updatedTasks = [...this.currentTasks(), taskWithGeneratedId];
    this.tasksSubject.next(updatedTasks);
    return of(taskWithGeneratedId);
  }

  /**
   * Deletes a task by its ID.
   * @param id The ID of the task to delete.
   * @returns An observable emitting void when deletion is successful.
   */
  public deleteTask(id: number): Observable<void> {
    const updatedTasksAfterDelete = this.currentTasks().filter(task => task.id !== id);
    this.tasksSubject.next(updatedTasksAfterDelete);
    return of(void 0);
  }

  /**
   * Deletes a task by its temporary ID.
   * @param tempId The temporary ID of the task to delete.
   */
  public deleteTaskByTempId(tempId: string): void {
    const updatedTasksAfterDelete = this.currentTasks().filter(task => task.tempId !== tempId);
    this.tasksSubject.next(updatedTasksAfterDelete);
  }

  /**
   * Handles errors and logs them.
   * @param error The error object (optional).
   * @param errorMessage A custom error message (default: 'An error occurred on the server').
   * @returns An observable emitting an error.
   */
  private handleError(
    error: any,
    errorMessage = 'An error occurred on the server'
  ): Observable<never> {
    console.error(errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}
