import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable, of, Subject, throwError } from "rxjs";
import { ETaskStatus, Task } from "../../models/task.model";
import { ITaskService } from "../interfaces/itask.service";
import { UtilityService } from "../utility.service";

@Injectable({
    providedIn: 'root'
})
export class TaskServiceMock implements ITaskService {

    private tasksSubject = new BehaviorSubject<Task[]>([]);

    // Observables publics pour les composants
    readonly tasks$ = this.tasksSubject.asObservable();

    private destroy$: Subject<void> = new Subject();

    private mockTasks: Task[] = [
        new Task({
            id: 1,
            title: 'Configurer Angular',
            description: 'Mettre en place l\'architecture du projet',
            status: ETaskStatus.PENDING,
            priority: 1,
            dueDate: new Date('2024-06-01'),
            createdAt: new Date(),
            updatedAt: new Date(),
        }),
        new Task({
            id: 2,
            title: 'Créer des composants',
            description: 'Créer les composants principaux pour le tableau de bord',
            status: ETaskStatus.IN_PROGRESS,
            priority: 2,
            dueDate: new Date('2024-06-05'),
            createdAt: new Date(),
            updatedAt: new Date(),
        }),
        new Task({
            id: 3,
            title: 'Tester les endpoints',
            description: 'Tester les appels aux endpoints mockés',
            status: ETaskStatus.DONE,
            priority: 3,
            dueDate: new Date('2024-05-28'),
            createdAt: new Date(),
            updatedAt: new Date(),
        }),
        new Task({
            id: 4,
            title: 'Corriger les bugs',
            description: 'Résoudre les problèmes d\'affichage des tâches',
            status: ETaskStatus.PENDING,
            priority: 1,
            dueDate: new Date('2024-06-10'),
            createdAt: new Date(),
            updatedAt: new Date(),
        }),
    ];

    constructor(private utilityService: UtilityService) { }

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
        console.log('Mock: Récupération de toutes les tâches');
        this.tasksSubject.next(this.mockTasks);
        return this.tasks$;
    }

    /**
     * Récupère toutes les tâches filtrées par leur statut
     * @param status Le statut à filtrer
     */
    public fetchTasksByStatus(status: ETaskStatus): Observable<Task[]> {
        console.log(`Mock: Récupération des tâches avec le statut ${status}`);
        return this.fetchAllTasks()
            .pipe(
                map(tasks => tasks.filter(task => task.status === status)));
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
     * Modifie le status des taches
     * @param modifiedTasks liste des taches modifiés par l'utilisateur
     * @returns la liste des taches modifiées
     */
    public updateTaskStatus(modifiedTasks: Task[]): Observable<Task[]> {
        console.log('Mock: Mise à jour du status des tâches');
        const updatedTasks = this.currentTasks().map(currentTask => {
            const modifiedTask = modifiedTasks.find(modifiedTask => modifiedTask.id === currentTask.id);
            if (modifiedTask) {
                currentTask.status = modifiedTask.status;
            }
            return currentTask;
        });

        this.tasksSubject.next(updatedTasks);
        return of(updatedTasks);
    }

    /**
     * Ajout d'une nouvelle tâche
     * @param newTask Nouvelle tâche
     * @returns La nouvelle tâche
     */
    public updateTask(updatedTask: Task): Observable<Task> {
        console.log("Mock: Mise à jour d'une tâche");
        let currentTasks = this.currentTasks();
        const taskIndex = currentTasks.findIndex(task => task.id === updatedTask.id);
        if (taskIndex !== -1) {
            currentTasks[taskIndex] = updatedTask;
            this.tasksSubject.next(currentTasks);
            return of(updatedTask);
        } else {
            console.error('Tâche introuvable dans le taskSubject');
            return this.handleError(null, 'Tâche introuvable');
        }
    }


    public addNewTask(newTask: Task): Observable<Task> {
        const generatedTempId = this.utilityService.generateTempId();
        const taskWithGenerateId = { ...newTask, tempId: generatedTempId };
        const currentTasks = this.currentTasks();
        const updatedTasks = [...currentTasks, taskWithGenerateId];
        this.tasksSubject.next(updatedTasks);
        return of(taskWithGenerateId);
    }

    public deleteTask(id: number): Observable<void> {
        const updatedTasksAfterDelete = this.currentTasks().filter(task => task.id !== id);
        this.tasksSubject.next(updatedTasksAfterDelete);
        return of(void 0);
    }

    public deleteTasktByTempId(tempId: string): void {
        const updatedTasksAfterDelete = this.currentTasks().filter(task => task.tempId !== tempId);
        this.tasksSubject.next(updatedTasksAfterDelete);
    }

    private handleError(error: any, errorMessage = 'Une erreur est survenue côté serveur'): Observable<never> {
        console.error(errorMessage, error);
        return throwError(() => new Error(errorMessage));
    }


}