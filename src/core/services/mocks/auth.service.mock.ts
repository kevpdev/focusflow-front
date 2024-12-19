import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { UserResponse } from "../../models";
import { User } from "../../models/user.model";
import { AuthStateService } from "../auth-state.service";

@Injectable({
    providedIn: 'root'
})
export class AuthServiceMock {

    constructor(private authStateService: AuthStateService) { }

    public login(email: string, password: string): Observable<User> {
        this.authStateService.setUser(new UserResponse({ email: email, roles: ['ADMIN'] }));
        return of(new User({
            email: email,
            roles: ['ADMIN']
        }));

    }


    public refreshToken(): Observable<boolean> {
        this.authStateService.setUser(new UserResponse({ email: "", roles: ['ADMIN'] }));
        return of(this.authStateService.isLoggedIn());
    }

    public logout(): Observable<void> {
        this.authStateService.userInfoSubject.next(null);
        this.authStateService.isAuthenticatedSubject.next(false);
        return of();
    }

    public isAuthenticated(): Observable<boolean> {
        return of(true);
    }

}