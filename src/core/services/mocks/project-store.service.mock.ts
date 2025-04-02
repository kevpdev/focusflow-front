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
      this.updateStoreProject(project);
      return of(project);
    } else {
      return this.handleError(null, 'Project not found');
    }
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

  deleteProject(id: number): Observable<void> {
    const updatedProjects = this.getProjects().filter(project => project.id !== id);
    this.projectsSubject.next(updatedProjects);

    return of(void 0);
  }

  private handleError(
    error: unknown,
    errorMessage = 'An error occurred on the server'
  ): Observable<never> {
    console.error(errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}
