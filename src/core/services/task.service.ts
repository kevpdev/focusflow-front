import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { catchError, map, takeUntil, tap } from 'rxjs/operators';
import { TaskEndpoint } from '../endpoints';
import { ETaskStatus, Task } from '../models/task.model';
import { ITaskService } from './interfaces/itask.service';
import { UtilityService } from './utility.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService implements ITaskService {
  readonly ERROR_MESSAGE = 'Une erreur est survenue coté serveur : ';
  // Les BehaviorSubjects pour stocker les tâches
  private tasksSubject = new BehaviorSubject<Task[]>([]);

  // Observables publics pour les composants
  public tasks$ = this.tasksSubject.asObservable();

  private destroy$: Subject<void> = new Subject();

  constructor(private taskEndpoint: TaskEndpoint,
    private utilityService: UtilityService
  ) { }


  /**
  * Récupère l'état actuel de la liste des tâches dans le sujet
  * @returns Un tableau de tâche
  */
  private currentTasks(): Task[] {
    return this.tasksSubject.getValue();
  }


  /**
   * Récupère toutes les tâches
   */
  public fetchAllTasks(): Observable<Task[]> {
    return this.taskEndpoint.fetchAllTasks()
      .pipe(
        takeUntil(this.destroy$),
        tap(tasks => console.log('Task list : ', tasks)),
        map(tasks => {
          this.tasksSubject.next(tasks);
          return tasks;
        }),
        catchError(this.handleError.bind(this)));
  }

  /**
   * Récupère toutes les tâches filtrées par leur statut
   * @param status Le statut à filtrer
   */
  public fetchTasksByStatus(status: ETaskStatus): Observable<Task[]> {
    return this.tasks$
      .pipe(
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
   * @param error 
   * @returns 
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
  public updateTaskStatus(modifiedTasks: Task[]): Observable<Task[]> {
    return this.taskEndpoint.fetchUpdateTaskStatus(modifiedTasks)
      .pipe(
        map(successfullyModifiedTasks => {
          // Modification qu'en cas de succes
          successfullyModifiedTasks.map(sfModifiedTask => {
            this.updateTaskSubject(sfModifiedTask);
          })
          return successfullyModifiedTasks;
        }),
        catchError(this.handleError.bind(this))
      );
  }

  /**
   * Suppression d'une tâche
   * @param id Id de la tache à supprimer
   * @returns 
   */
  public deleteTask(id: number): Observable<void> {
    //sauvegarder la liste actuelle dans le subject
    const currentTasks = this.currentTasks();
    // supprimer l'id dans le subject
    this.removeTaskSubject(id);
    //appeler l'api pour suppression
    return this.taskEndpoint.fetchDeleteTask(id)
      .pipe(
        catchError((error) => {
          //si echec remettre l'ancien liste dans le subject
          this.tasksSubject.next(currentTasks);
          return this.handleError(error);
        }));
  }

  /**
 * Ajout d'une nouvelle tâche 
 * @param newTask Nouvelle tâche
 * @returns La nouvelle tâche
 */
  public addNewTask(newTask: Task): Observable<Task> {

    // générer un id 
    const generatedTempId = this.utilityService.generateTempId();

    // mettreà jour la tache avec l'id généré
    newTask = { ...newTask, tempId: generatedTempId };
    // ajouter tache dans subject en premier pour la réactivité
    this.addTaskSubject(newTask);
    //mettre a jour la tache dans l'api
    return this.taskEndpoint.fetchAddNewTask(newTask)
      .pipe(
        map(addedTask => {
          // si api succes, mettre a jour id géneré par id api
          this.currentTasks().map(currentTask => currentTask.tempId === generatedTempId ? addedTask : currentTask);
          return addedTask;
        }),
        catchError(error => {
          //si error supprimé la tache dans subjet
          this.removeTaskSubjectByTempId(generatedTempId);
          return this.handleError(error);
        }));

  }

  public updateTask(modifiedTask: Task): Observable<Task> {
    const taskBeforeUpdate = this.currentTasks()
      .find(currentTask => currentTask.id === modifiedTask.id);

    if (taskBeforeUpdate) {
      this.updateTaskSubject(modifiedTask);
      return this.taskEndpoint.fetchUpdateTask(modifiedTask)
        .pipe(
          catchError(error => {
            // retour arrière
            this.updateTaskSubject(taskBeforeUpdate);
            return this.handleError(error);
          }));
    } else {
      console.error('La tâche à modifier est introuvable dans le store');
      return this.handleError(new Error('La tâche à modifier est introuvable'));
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
      console.error('Tâche introuvable dans le taskSubject');
      throw new Error('Tâche introuvable');
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
