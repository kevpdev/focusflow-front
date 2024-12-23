import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { ETaskStatus, Task } from "../../models/task.model";

@Injectable({
    providedIn: 'root'
})
export class TaskServiceMock {
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

    /**
     * Récupère toutes les tâches
     */
    public findAllTasks(): Observable<Task[]> {
        console.log('Mock: Récupération de toutes les tâches');
        return of(this.mockTasks);
    }

    /**
     * Récupère toutes les tâches filtrées par leur statut
     * @param status Le statut à filtrer
     */
    public fetchTasksByStatus(status: ETaskStatus): Observable<Task[]> {
        console.log(`Mock: Récupération des tâches avec le statut ${status}`);
        const filteredTasks = this.mockTasks.filter(task => task.status === status);
        return of(filteredTasks);
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
    public fetchUpdateTaskStatus(modifiedTasks: Task[]): Observable<Task[]> {
        console.log('Mock: Mise à jour du status des tâches');
        modifiedTasks.map(modifiedTask => {
            let task = this.mockTasks.find(mockTask => mockTask.id === modifiedTask.id);
            if (task) {
                task.status = modifiedTask.status;
            }
        })
        return of(this.mockTasks);

    }

    /**
     * Suppression d'une tâche
     * @param id Id de la tache à supprimer
     * @returns 
     */
    public fetchDeleteTask(id: number): Observable<void> {
        console.log('Mock: Suppression de la tâche : ', id);
        this.mockTasks = this.mockTasks.filter(task => task.id === id);
        return of(void 0);
    }

}