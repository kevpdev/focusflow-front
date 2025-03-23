import { EStatus, Task } from "src/core/models";
import { BugTask } from "src/core/models/bug-task.model";
import { Project } from "src/core/models/project.model";

export const mockTasksProject = [
    new Task({
        id: 1,
        projectId: 1,
        title: 'Configurer Angular',
        description: 'Mettre en place l\'architecture du projet',
        status: EStatus.PENDING,
        priority: 1,
        dueDate: new Date('2024-06-01'),
    }),
    new Task({
        id: 2,
        projectId: 1,
        title: 'Créer des composants',
        description: 'Créer les composants principaux pour le tableau de bord',
        status: EStatus.IN_PROGRESS,
        priority: 2,
        dueDate: new Date('2024-06-05'),
    }),
    new Task({
        id: 3,
        projectId: 1,
        title: 'Tester les endpoints',
        description: 'Tester les appels aux endpoints mockés',
        status: EStatus.DONE,
        priority: 3,
        dueDate: new Date('2024-05-28'),
        createdAt: new Date(),
        updatedAt: new Date(),
    }),
    new BugTask({
        id: 4,
        projectId: 1,
        title: 'Corriger les bugs',
        description: 'Résoudre les problèmes d\'affichage des tâches',
        status: EStatus.PENDING,
        priority: 1,
        dueDate: new Date('2024-06-10'),
    }),
    new Task({
        id: 5,
        projectId: 2,
        title: 'Créer les modèles de données',
        description: 'Définir les entités Spring Boot pour les tâches, sessions, et notifications',
        status: EStatus.PENDING,
        priority: 1,
        dueDate: new Date('2024-06-03'),
    }),
    new Task({
        id: 6,
        projectId: 2,
        title: 'Implémenter l’authentification JWT',
        description: 'Configurer Spring Security avec JWT pour sécuriser les endpoints',
        status: EStatus.IN_PROGRESS,
        priority: 2,
        dueDate: new Date('2024-06-06'),
    }),
    new Task({
        id: 7,
        projectId: 2,
        title: 'Développer les endpoints des tâches',
        description: 'CRUD complet sur les tâches avec contrôleurs REST',
        status: EStatus.PENDING,
        priority: 1,
        dueDate: new Date('2024-06-08'),
    }),
    new Task({
        id: 8,
        projectId: 2,
        title: 'Configurer PostgreSQL',
        description: 'Connexion à la base, création des schémas et initialisation des tables',
        status: EStatus.DONE,
        priority: 3,
        dueDate: new Date('2024-05-30'),
        createdAt: new Date(),
        updatedAt: new Date(),
    }),
    new BugTask({
        id: 9,
        projectId: 2,
        title: 'Bug sur la session de focus',
        description: 'Session ne passe pas à "DONE" à la fin du timer',
        status: EStatus.PENDING,
        priority: 1,
        dueDate: new Date('2024-06-10'),
    })
];



export const mockProjects = [
    new Project({
        id: 1,
        name: 'Project 1',
        description: 'Description du projet 1',
        tasks: [],
        userId: 1,
    }),
    new Project({
        id: 2,
        name: 'Project 2',
        description: 'Description du projet 2',
        tasks: [],
        userId: 1,
    }),
];