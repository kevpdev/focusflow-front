import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { TaskEndpoint } from '../endpoints';
import { ETaskStatus, Task } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  readonly ERROR_MESSAGE = 'Une erreur est survenue coté serveur : ';

  constructor(private taskEndpoint: TaskEndpoint) { }

  /**
   * Récupère toutes les tâches
   */
  public findAllTasks(): Observable<Task[]> {
    return this.taskEndpoint.findAllTasks().pipe(
      tap(tasks => console.log('Task list : ', tasks)),
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * Récupère toutes les tâches filtrées par leur statut
   * @param status Le statut à filtrer
   */
  public fetchTasksByStatus(status: ETaskStatus): Observable<Task[]> {
    return this.taskEndpoint.findAllTasksByStatus(status).pipe(
      map(tasks => tasks.filter(task => task.status === status)),
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * Récupère les tâches en attente
   */
  public fetchAllPendingTasks(): Observable<Task[]> {
    return this.fetchTasksByStatus(ETaskStatus.PENDING);
  }

  /**
   * Récupère les tâches en cours
   */
  public fetchAllInProgressTasks(): Observable<Task[]> {
    return this.fetchTasksByStatus(ETaskStatus.IN_PROGRESS);
  }

  /**
   * Récupère les tâches terminées
   */
  public fetchFinishedTasks(): Observable<Task[]> {
    return this.fetchTasksByStatus(ETaskStatus.DONE);
  }

  /**
   * Gestion centralisée des erreurs
   */
  private handleError(error: any): Observable<never> {
    console.error(this.ERROR_MESSAGE, error);
    return throwError(() => new Error(this.ERROR_MESSAGE + error.message));
  }

  /**
   * Modifie le status des taches
   * @param modifiedTasks liste des taches modifiés par l'utilisateur
   * @returns la liste des taches modifiées
   */
  public fetchUpdateTaskStatus(modifiedTasks: Task[]): Observable<Task[]> {

    return of([]);

  }

  /**
 * 
 * @param id Id de la tache à supprimer
 * @returns 
 */
  public fetchDeleteTask(id: number): Observable<void> {
    return of()
  }
}
