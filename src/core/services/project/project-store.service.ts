import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { IProjectStoreService, Project } from 'src/core/models';
import { ProjectApiService } from './project-api.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectStoreService implements IProjectStoreService {

  private projectsSubject = new BehaviorSubject<Project[]>([]);
  readonly projects$ = this.projectsSubject.asObservable();

  constructor(private projectApiService: ProjectApiService) { }

  getProjects(): Project[] {
    return this.projectsSubject.getValue();
  }

  fetchAllProjects(): Observable<Project[]> {
    return this.projectApiService.fetchAllProjects()
      .pipe(
        map(projects => {
          this.projectsSubject.next(projects);
          return projects;
        }),
        catchError(err => this.handleError(err, 'Une erreur est survenue lors de la récupération de tous les projets.')));
  }

  fetchProjectById(id: number): Observable<Project> {
    return this.projectApiService.fetchProjectById(id)
      .pipe(
        map(project => {
          this.projectsSubject.next([project]);
          return project;
        }),
        catchError(err => this.handleError(err, 'Une erreur est survenue lors de la récupération du projet.')));
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
