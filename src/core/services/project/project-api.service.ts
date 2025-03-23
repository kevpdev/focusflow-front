import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Project } from 'src/core/models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectApiService {

  private http = inject(HttpClient);
  private apiUrl = environment.apiURL + 'projects';

  constructor() { }

  fetchAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl);
  }

  fetchProjectById(id: number): Observable<Project> {
    return this.http.get<Project>(this.apiUrl + '/' + id);
  }
}
