import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { IProjectStoreService } from 'src/core/models';
import { Project } from 'src/core/models/project.model';
import { mockProjects } from './mock-data.mock';

@Injectable({
  providedIn: 'root',
})
export class ProjectStoreServiceMock implements IProjectStoreService {
  private projectsSubject = new BehaviorSubject<Project[]>([]);

  readonly projects$ = this.projectsSubject.asObservable();

  private readonly mockProjects: Project[] = mockProjects;

  constructor() {}

  getProjects(): Project[] {
    return this.projectsSubject.getValue();
  }

  setProjectsForTest(projects: Project[]): void {
    return this.projectsSubject.next(projects);
  }

  fetchAllProjects(): Observable<Project[]> {
    console.log('Mock: Fetching all projects');
    this.projectsSubject.next(this.mockProjects);
    return of(this.mockProjects);
  }

  fetchProjectById(id: number): Observable<Project> {
    console.log('Mock: Fetching project by ID');
    const project = this.mockProjects.find(project => project.id === id);
    if (project) {
      this.projectsSubject.next([project]);
      return of(project);
    } else {
      return this.handleError(null, 'Project not found');
    }
  }

  private handleError(
    error: any,
    errorMessage = 'An error occurred on the server'
  ): Observable<never> {
    console.error(errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}
