import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { ETaskStatus, Task } from "../../models/task.model";

@Injectable({
    providedIn: 'root'
})
export class TaskApiService {

    public http = inject(HttpClient);
    public apiUrl = environment.apiURL + 'tasks';

    public fetchAllTasks(): Observable<Task[]> {
        return this.http.get<Task[]>(this.apiUrl);
    }

    public fetchAllTasksByStatus(status: ETaskStatus): Observable<Task[]> {
        const options = { params: new HttpParams().set('status', status) };
        return this.http.get<Task[]>(this.apiUrl + '/search', options);
    }

    public fetchDeleteTask(id: number): Observable<void> {
        return this.http.delete<void>(this.apiUrl + `/${id}`)
    }

    /**
     * Modifie le status des taches
     * @param modifiedTasks liste des taches modifiés par l'utilisateur
     * @returns la liste des taches modifiées
     */
    public fetchUpdateTaskStatus(modifiedTasks: Task[]): Observable<Task[]> {
        return this.http.put<Task[]>(this.apiUrl + '/status', modifiedTasks);
    }


    public fetchUpdateTask(modifiedTask: Task): Observable<Task> {
        return this.http.put<Task>(this.apiUrl + `/${modifiedTask.id}`, modifiedTask);
    }


    public fetchAddNewTask(newTask: Task): Observable<Task> {
        return this.http.post<Task>(this.apiUrl, newTask);
    }

}