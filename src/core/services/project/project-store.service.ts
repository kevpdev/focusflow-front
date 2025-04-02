import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { IProjectStoreService, Project } from 'src/core/models';
import { ProjectApiService } from './project-api.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectStoreService implements IProjectStoreService {
  private projectsSubject = new BehaviorSubject<Project[]>([]);
  readonly projects$ = this.projectsSubject.asObservable();

  constructor(private projectApiService: ProjectApiService) {}

  getProjects(): Project[] {
    return this.projectsSubject.getValue();
  }

  fetchAllProjects(): Observable<Project[]> {
    return this.projectApiService.fetchAllProjects().pipe(
      map(projects => {
        this.projectsSubject.next(projects);
        return projects;
      }),
      catchError(err =>
        this.handleError(
          err,
          'Une erreur est survenue lors de la récupération de tous les projets.'
        )
      )
    );
  }

  fetchProjectById(id: number): Observable<Project> {
    return this.projectApiService.fetchProjectById(id).pipe(
      map(project => {
        this.updateStoreProject(project);
        return project;
      }),
      catchError(err =>
        this.handleError(err, 'Une erreur est survenue lors de la récupération du projet.')
      )
    );
  }

  deleteProject(id: number): Observable<void> {
    const currentStoreProjects = [...this.getProjects()];
    this.deleteProjectFromStore(id);

    return this.projectApiService.fetchDeleteProject(id).pipe(
      catchError(err => {
        this.projectsSubject.next(currentStoreProjects);
        return this.handleError(err, 'Une erreur est survenue lors de la suppression du projet.');
      })
    );
  }

  updateStoreProject(project: Project): void {
    const index = this.getProjects().findIndex(currentProject => currentProject.id === project.id);
    let newProjectsStorList;

    if (index !== -1) {
      newProjectsStorList = this.getProjects().map(currentStoreProject =>
        currentStoreProject.id === project.id ? project : currentStoreProject
      );
    } else {
      newProjectsStorList = [...this.getProjects(), project];
    }
    this.projectsSubject.next(newProjectsStorList);
  }

  deleteProjectFromStore(id: number): void {
    const updatedProjects = this.getProjects().filter(project => project.id !== id);
    console.log('updatedProjects', updatedProjects);

    this.projectsSubject.next(updatedProjects);
  }

  /**
   * Handles errors and logs them.
   * @param error The error object (optional).
   * @param errorMessage A custom error message (default: 'An error occurred on the server').
   * @returns An observable emitting an error.
   */
  private handleError(
    error: unknown,
    errorMessage = 'An error occurred on the server'
  ): Observable<never> {
    console.error(errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}
