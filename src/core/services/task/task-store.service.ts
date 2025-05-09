import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { EStatus, ITaskStoreService } from 'src/core/models';
import { Task } from '../../models/task.model';
import { UtilityService } from '../ui/utility/utility.service';
import { TaskApiService } from './task-api.service';

@Injectable({
  providedIn: 'root',
})
export class TaskStoreService implements ITaskStoreService {
  readonly ERROR_MESSAGE = 'Une erreur est survenue coté serveur : ';
  // BehaviorSubjects to store  tasks
  private tasksSubject = new BehaviorSubject<Task[]>([]);

  // Observables pour les composants
  public pendingTasks$: Observable<Task[]> = this.tasks$.pipe(
    map(tasks => tasks.filter(task => task.status === EStatus.PENDING))
  );

  public inProgressTasks$: Observable<Task[]> = this.tasks$.pipe(
    map(tasks => tasks.filter(task => task.status === EStatus.IN_PROGRESS))
  );

  public doneTasks$: Observable<Task[]> = this.tasks$.pipe(
    map(tasks => tasks.filter(task => task.status === EStatus.DONE))
  );

  constructor(
    private taskApiService: TaskApiService,
    private utilityService: UtilityService
  ) {}

  /**
   * Retrieves the current state of the task list in the subject
   * @returns An array of tasks
   */

  get tasks$(): Observable<Task[]> {
    return this.tasksSubject.asObservable();
  }

  public getTasks(): Task[] {
    return this.tasksSubject.getValue();
  }

  /**
   * Set the tasks store for tests
   * @param tasks
   */
  public setTasksForTest(tasks: Task[]): void {
    return this.tasksSubject.next(tasks);
  }

  /**
   * Retrieves a task by its ID
   * @param id Task ID
   * @returns A task
   */
  public getTaskById(id: number): Task {
    const index = this.getTasks().findIndex(currentask => currentask.id === id);

    if (index < 0) {
      const errorMessage = 'La tâche est introuvable.';
      throw new Error(errorMessage);
    }

    return this.getTasks()[index];
  }

  /**
   * Retrieves all tasks
   */
  public fetchAllTasksByProjectId(id: number): Observable<Task[]> {
    return this.taskApiService.fetchAllTasksByProjectId(id).pipe(
      map(tasks => {
        this.tasksSubject.next(tasks);
        return tasks;
      }),
      catchError(err =>
        this.handleError(
          err,
          'Une erreur est survenue lors de la récupération de toutes les tâches.'
        )
      )
    );
  }

  /**
   * Retrieves all tasks filtered by their status
   * @param status Status to filter by
   */
  public fetchTasksByStatus(status: EStatus): Observable<Task[]> {
    return this.tasks$.pipe(
      map(tasks => tasks.filter(task => task.status === status)),
      catchError(err =>
        this.handleError(
          err,
          'Une erreur est survenue lors de la récupération des tâches ' + status
        )
      )
    );
  }

  /**
   * Retrieves pending tasks
   */
  public fetchAllPendingTasks(): Observable<Task[]> {
    return this.fetchTasksByStatus(EStatus.PENDING);
  }

  /**
   * Retrieves tasks in progress
   */
  public fetchAllInProgressTasks(): Observable<Task[]> {
    return this.fetchTasksByStatus(EStatus.IN_PROGRESS);
  }

  /**
   * Retrieves finished tasks
   */
  public fetchFinishedTasks(): Observable<Task[]> {
    return this.fetchTasksByStatus(EStatus.DONE);
  }

  /**
   * Centralized error handling
   * @param error
   * @returns
   */
  private handleError(error: unknown, message: string): Observable<never> {
    console.error(message, error);
    return throwError(() => new Error(message));
  }

  /**
   * Updates the status of tasks
   * @param modifiedTasks List of tasks modified by the user
   * @returns List of modified tasks
   */
  updateTaskStatus(task: Task, newStatus: EStatus): Observable<Task> {
    const currentTask = this.getTaskById(task.id);
    if (!currentTask) {
      return this.handleError(new Error(), 'La tâche à modifier est introuvable');
    }
    const updatedTask = { ...currentTask, status: newStatus };

    //maj store
    this.tasksSubject.next(
      this.getTasks().map(task => (task.id === updatedTask.id ? updatedTask : task))
    );

    return this.taskApiService.fetchUpdateTask(updatedTask).pipe(
      catchError(error => {
        // Rollback
        this.updateTaskSubject(currentTask);
        return this.handleError(
          error,
          'Une erreur est survenue lors de la modification de la tâche.'
        );
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
    const currentTasks = this.getTasks();
    // Remove the ID in the subject
    this.removeTaskSubject(id);
    // Call the API to delete
    return this.taskApiService.fetchDeleteTask(id).pipe(
      catchError(error => {
        // If failed, restore the previous list in the subject
        this.tasksSubject.next(currentTasks);
        return this.handleError(
          error,
          'Une erreur est survenue lors de la suppression de la tâche.'
        );
      })
    );
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
    return this.taskApiService.fetchAddNewTask(newTask).pipe(
      map(addedTask => {
        // If API succeeds, update the generated ID with the API ID
        const updatedTasks = this.getTasks().map(currentTask =>
          currentTask.tempId === generatedTempId ? addedTask : currentTask
        );
        this.tasksSubject.next(updatedTasks);
        return addedTask;
      }),
      catchError(error => {
        // If error, remove the task in the subject
        this.removeTaskSubjectByTempId(generatedTempId);
        return this.handleError(error, "Une erreur est survenue lors de l'ajout de la tâches.");
      })
    );
  }

  /**
   * Updates a task
   * @param modifiedTask Task to update
   * @returns The updated task
   */
  public updateTask(modifiedTask: Task): Observable<Task> {
    const taskBeforeUpdate = this.getTasks().find(
      currentTask => currentTask.id === modifiedTask.id
    );

    if (taskBeforeUpdate) {
      this.updateTaskSubject(modifiedTask);
      return this.taskApiService.fetchUpdateTask(modifiedTask).pipe(
        catchError(error => {
          // Rollback
          this.updateTaskSubject(taskBeforeUpdate);
          return this.handleError(
            error,
            'Une erreur est survenue lors de la modification de la tâche.'
          );
        })
      );
    } else {
      return this.handleError(new Error(), 'La tâche est introuvable dans le store.');
    }
  }

  /** CRUD TASK SUBJECT STORE **/

  private updateTaskSubject(updatedTask: Task): void {
    const currentTasks = this.getTasks();
    const taskIndex = currentTasks.findIndex(task => task.id === updatedTask.id);
    if (taskIndex !== -1) {
      currentTasks[taskIndex] = updatedTask;
      this.tasksSubject.next(currentTasks);
    } else {
      throw new Error('La tâche est introuvable.');
    }
  }

  private addTaskSubject(newTask: Task): void {
    const currentTasks = this.getTasks();
    const updatedTasks = [...currentTasks, newTask];
    this.tasksSubject.next(updatedTasks);
  }

  private removeTaskSubject(id: number): void {
    const updatedTasksAfterDelete = this.getTasks().filter(task => task.id !== id);
    this.tasksSubject.next(updatedTasksAfterDelete);
  }

  private removeTaskSubjectByTempId(tempId: string): void {
    const updatedTasksAfterDelete = this.getTasks().filter(task => task.tempId !== tempId);
    this.tasksSubject.next(updatedTasksAfterDelete);
  }
}
