import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment.development";
import { ETaskStatus, Task } from "../models/task.model";

@Injectable({
    providedIn: 'root'
})
export class TaskEndpoint {

    public http = inject(HttpClient);
    public apiUrl = environment.apiURL;

    public findAllTasks(): Observable<Task[]> {
        return this.http.get<Task[]>(this.apiUrl + 'tasks');
    }

    public findAllTasksByStatus(status: ETaskStatus): Observable<Task[]> {
        console.log(status);
        const options = { params: new HttpParams().set('status', status) };
        console.log(options);
        return this.http.get<Task[]>(this.apiUrl + 'tasks/search', options);
    }

}