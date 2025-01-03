import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable, of, throwError } from "rxjs";
import { ETaskStatus, Task } from "../../models/task.model";
import { ITaskStoreService } from "../interfaces/itask-store.service";
import { UtilityService } from "../utility.service";

@Injectable({
    providedIn: 'root'
})
export class TaskStoreServiceMock implements ITaskStoreService {

    private tasksSubject = new BehaviorSubject<Task[]>([]);

    // public observables for components
    readonly tasks$ = this.tasksSubject.asObservable();

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
    public fetchAllTasks(): Observable<Task[]> {
        console.log('Mock: Fetching all tasks');
        this.tasksSubject.next(this.mockTasks);
        return this.tasks$;
    }

    /**
     * Retrieves all tasks filtered by their status.
     * @param status The status to filter tasks by.
     * @returns An observable emitting the filtered tasks.
     */
    public fetchTasksByStatus(status: ETaskStatus): Observable<Task[]> {
        console.log(`Mock: Fetching tasks with status ${status}`);
        return this.fetchAllTasks().pipe(
            map(tasks => tasks.filter(task => task.status === status))
        );
    }

    /**
     * Retrieves all pending tasks.
     * @returns An observable emitting tasks with the `PENDING` status.
     */
    public fetchAllPendingTasks(): Observable<Task[]> {
        return this.fetchTasksByStatus(ETaskStatus.PENDING);
    }

    /**
     * Retrieves all tasks in progress.
     * @returns An observable emitting tasks with the `IN_PROGRESS` status.
     */
    public fetchAllInProgressTasks(): Observable<Task[]> {
        return this.fetchTasksByStatus(ETaskStatus.IN_PROGRESS);
    }

    /**
     * Retrieves all finished tasks.
     * @returns An observable emitting tasks with the `DONE` status.
     */
    public fetchFinishedTasks(): Observable<Task[]> {
        return this.fetchTasksByStatus(ETaskStatus.DONE);
    }

    /**
     * Updates the status of tasks.
     * @param modifiedTasks A list of tasks with updated statuses.
     * @returns An observable emitting the list of updated tasks.
     */
    public updateTaskStatus(modifiedTasks: Task[]): Observable<Task[]> {
        console.log('Mock: Updating task statuses');
        const updatedTasks = this.currentTasks().map(currentTask => {
            const modifiedTask = modifiedTasks.find(task => task.id === currentTask.id);
            if (modifiedTask) {
                currentTask.status = modifiedTask.status;
            }
            return currentTask;
        });

        this.tasksSubject.next(updatedTasks);
        return of(updatedTasks);
    }

    /**
     * Updates an existing task.
     * @param updatedTask The task with updated details.
     * @returns An observable emitting the updated task.
     */
    public updateTask(updatedTask: Task): Observable<Task> {
        console.log("Mock: Updating a task");
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
    private handleError(error: any, errorMessage = 'An error occurred on the server'): Observable<never> {
        console.error(errorMessage, error);
        return throwError(() => new Error(errorMessage));
    }


}