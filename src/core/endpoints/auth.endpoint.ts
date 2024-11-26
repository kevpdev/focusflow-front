import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment.development";
import { UserRequest, UserResponse } from "../models";

@Injectable({
    providedIn: 'root'
})
export class AuthEndpoint {

    public http = inject(HttpClient);
    public apiUrl = environment.apiURL;

    public login(email: string, password: string): Observable<UserResponse> {
        const userRequestBody = new UserRequest({ email: email, password: password });
        return this.http.post<UserResponse>(this.apiUrl + 'auth/login', userRequestBody);
    }

    public refreshToken(): Observable<UserResponse> {
        return this.http.post<UserResponse>(`${this.apiUrl}auth/refresh`, {});
    }

    public isAuthenticated(): Observable<boolean> {
        return this.http.get<boolean>(`${this.apiUrl}auth/isAuthenticated`);
    }


    public logout(): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}auth/logout`, {});
    }

}



