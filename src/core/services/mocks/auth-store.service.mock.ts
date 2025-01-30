import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { UserResponse } from "../../models";
import { User } from "../../models/user.model";

@Injectable({
    providedIn: 'root'
})
export class AuthStoreServiceMock {

    public readonly userStorageId = 'user';
    public isRefreshing = false;
    public userInfoSubject = new BehaviorSubject<User | null>(null);
    public readonly userInfo$ = this.userInfoSubject.asObservable();
    public isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
    public readonly isAuthenticated$ = this.isAuthenticatedSubject.asObservable();


    constructor() { }

    public login(email: string, password: string): Observable<User> {
        this.setUser(new UserResponse({ email: email, roles: ['ADMIN'] }));
        return of(new User({
            email: email,
            roles: ['ADMIN']
        }));

    }


    public refreshToken(): Observable<boolean> {
        this.setUser(new UserResponse({ email: "", roles: ['ADMIN'] }));
        return of(this.isLoggedIn());
    }

    public logout(): Observable<boolean> {
        this.userInfoSubject.next(null);
        this.isAuthenticatedSubject.next(false);
        return of(true);
    }

    public isAuthenticated(): Observable<boolean> {
        return of(true);
    }


    public setUser(userResponse: UserResponse): void {
        const user = new User(
            {
                email: userResponse.email,
                roles: userResponse.roles
            })

        this.userInfoSubject.next(user);

    }

    public hasRoles(role: string): boolean {

        let userInfoSubjectValue = this.userInfoSubject.value;

        if (userInfoSubjectValue && userInfoSubjectValue.roles) {
            return userInfoSubjectValue.roles.includes(role);
        }

        return false;
    }



    public isLoggedIn(): boolean {
        return this.isAuthenticatedSubject.value;
    }

}