import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Project } from 'src/core/models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProjectApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiURL + 'projects';

  fetchAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl);
  }

  fetchCreateProject(project: Project): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, project);
  }

  fetchProjectById(id: number): Observable<Project> {
    return this.http.get<Project>(this.apiUrl + '/' + id);
  }

  fetchDeleteProject(id: number): Observable<void> {
    return this.http.delete<void>(this.apiUrl + '/' + id);
  }
}
