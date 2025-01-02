import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { catchError, map, takeUntil, tap } from 'rxjs/operators';
import { ETaskStatus, Task } from '../../models/task.model';
import { ITaskStoreService } from '../interfaces/itask-store.service';
import { UtilityService } from '../utility.service';
import { TaskApiService } from './task-api.service';

@Injectable({
  providedIn: 'root',
})
export class TaskStoreService implements ITaskStoreService {
  readonly ERROR_MESSAGE = 'Une erreur est survenue coté serveur : ';
  // BehaviorSubjects to store tasks
  public tasksSubject = new BehaviorSubject<Task[]>([]);

  // Public observables for components
  public tasks$ = this.tasksSubject.asObservable();

  private destroy$: Subject<void> = new Subject();

  constructor(private taskApiService: TaskApiService,
    private utilityService: UtilityService
  ) { }

  /**
  * Retrieves the current state of the task list in the subject
  * @returns An array of tasks
  */
  private currentTasks(): Task[] {
    return this.tasksSubject.getValue();
  }

  /**
   * Retrieves a task by its ID
   * @param id Task ID
   * @returns A task
   */
  public getTask(id: number): Task {

    const index = this.currentTasks()
      .findIndex(currentask => currentask.id === id);

    if (!index) {
      const errorMessage = 'Task not found';
      console.error(errorMessage);
      throw new Error(errorMessage)
    }

    return this.currentTasks()[index];

  }

  /**
   * Retrieves all tasks
   */
  public fetchAllTasks(): Observable<Task[]> {
    return this.taskApiService.fetchAllTasks()
      .pipe(
        takeUntil(this.destroy$),
        tap(tasks => console.log('Task list : ', tasks)),
        map(tasks => {
          this.tasksSubject.next(tasks);
          return tasks;
        }),
        catchError(err => this.handleError(err, 'Une erreur est survenue lors de la récupération de toutes les tâches.')));
  }

  /**
   * Retrieves all tasks filtered by their status
   * @param status Status to filter by
   */
  public fetchTasksByStatus(status: ETaskStatus): Observable<Task[]> {
    return this.tasks$
      .pipe(
        map(tasks => tasks.filter(task => task.status === status)),
        catchError(err => this.handleError(err, 'Une erreur est survenue lors de la récupération des tâches ' + status)));
  }

  /**
   * Retrieves pending tasks
   */
  public fetchAllPendingTasks(): Observable<Task[]> {
    return this.fetchTasksByStatus(ETaskStatus.PENDING);
  }

  /**
   * Retrieves tasks in progress
   */
  public fetchAllInProgressTasks(): Observable<Task[]> {
    return this.fetchTasksByStatus(ETaskStatus.IN_PROGRESS);
  }

  /**
   * Retrieves finished tasks
   */
  public fetchFinishedTasks(): Observable<Task[]> {
    return this.fetchTasksByStatus(ETaskStatus.DONE);
  }

  /**
   * Centralized error handling
   * @param error 
   * @returns 
   */
  private handleError(error: any, message: string): Observable<never> {
    console.error(message, error);
    return throwError(() => new Error(message));
  }

  /**
   * Updates the status of tasks
   * @param modifiedTasks List of tasks modified by the user
   * @returns List of modified tasks
   */
  public updateTaskStatus(modifiedTasks: Task[]): Observable<Task[]> {
    return this.taskApiService.fetchUpdateTaskStatus(modifiedTasks)
      .pipe(
        map(successfullyModifiedTasks => {
          // Update only in case of success
          successfullyModifiedTasks.map(sfModifiedTask => {
            this.updateTaskSubject(sfModifiedTask);
          })
          return successfullyModifiedTasks;
        }),
        catchError(err => {
          const errorMessage = 'Une erreur est survenue lors de la modification du statut des tâches.';
          return this.handleError(err, errorMessage);
        })
      );
  }

  /**
   * Deletes a task
   * @param id ID of the task to delete
   * @returns 
   */
  public deleteTask(id: number): Observable<void> {
    // Save the current list in the subject
    const currentTasks = this.currentTasks();
    // Remove the ID in the subject
    this.removeTaskSubject(id);
    // Call the API to delete
    return this.taskApiService.fetchDeleteTask(id)
      .pipe(
        catchError((error) => {
          // If failed, restore the previous list in the subject
          this.tasksSubject.next(currentTasks);
          return this.handleError(error, 'Une erreur est survenue lors de la suppression de la tâche.');
        }));
  }

  /**
   * Adds a new task
   * @param newTask New task
   * @returns The new task
   */
  public addNewTask(newTask: Task): Observable<Task> {

    // Generate an ID 
    const generatedTempId = this.utilityService.generateTempId();

    // Update the task with the generated ID
    newTask = { ...newTask, tempId: generatedTempId };
    // Add the task to the subject first for reactivity
    this.addTaskSubject(newTask);
    // Update the task in the API
    return this.taskApiService.fetchAddNewTask(newTask)
      .pipe(
        map(addedTask => {
          // If API succeeds, update the generated ID with the API ID
          const updatedTasks = this.currentTasks().map(currentTask => currentTask.tempId === generatedTempId ? addedTask : currentTask);
          this.tasksSubject.next(updatedTasks);
          return addedTask;
        }),
        catchError(error => {
          // If error, remove the task in the subject
          this.removeTaskSubjectByTempId(generatedTempId);
          return this.handleError(error, "Une erreur est survenue lors de l'ajout de la tâches.");
        }));

  }

  /**
   * Updates a task
   * @param modifiedTask Task to update
   * @returns The updated task
   */
  public updateTask(modifiedTask: Task): Observable<Task> {
    const taskBeforeUpdate = this.currentTasks()
      .find(currentTask => currentTask.id === modifiedTask.id);

    if (taskBeforeUpdate) {
      this.updateTaskSubject(modifiedTask);
      return this.taskApiService.fetchUpdateTask(modifiedTask)
        .pipe(
          catchError(error => {
            // Rollback
            this.updateTaskSubject(taskBeforeUpdate);
            return this.handleError(error, 'Une erreur est survenu lors de la modification de la tâche.');
          }));
    } else {
      return this.handleError(new Error('The task to update is not found in the store'), '');
    }

  }

  /** CRUD TASK SUBJECT STORE **/

  private updateTaskSubject(updatedTask: Task): void {
    let currentTasks = this.currentTasks();
    const taskIndex = currentTasks.findIndex(task => task.id === updatedTask.id);
    if (taskIndex !== -1) {
      currentTasks[taskIndex] = updatedTask;
      this.tasksSubject.next(currentTasks);
    } else {
      console.error('Task not found in the taskSubject');
      throw new Error('Task not found');
    }
  }

  private addTaskSubject(newTask: Task): void {
    const currentTasks = this.currentTasks();
    const updatedTasks = [...currentTasks, newTask];
    this.tasksSubject.next(updatedTasks);
  }

  private removeTaskSubject(id: number): void {
    const updatedTasksAfterDelete = this.currentTasks().filter(task => task.id !== id);
    this.tasksSubject.next(updatedTasksAfterDelete);
  }

  private removeTaskSubjectByTempId(tempId: string): void {
    const updatedTasksAfterDelete = this.currentTasks().filter(task => task.tempId !== tempId);
    this.tasksSubject.next(updatedTasksAfterDelete);
  }

}





