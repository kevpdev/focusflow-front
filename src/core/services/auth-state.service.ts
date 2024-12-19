import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserResponse } from '../models';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {

  public userInfoSubject = new BehaviorSubject<User | null>(null);
  public readonly userInfo$ = this.userInfoSubject.asObservable();
  public isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public readonly isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() { }

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
