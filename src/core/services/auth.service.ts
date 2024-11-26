import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { AuthEndpoint } from '../endpoints';
import { UserResponse } from '../models';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public userInfoSubject = new BehaviorSubject<User | null>(null);
  public readonly userInfo$ = this.userInfoSubject.asObservable();
  public isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public readonly isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  public readonly userStorageId = 'user';
  public isRefreshing = false;

  constructor(private authEndpoint: AuthEndpoint) { }


  public login(email: string, password: string): Observable<User> {

    return this.authEndpoint.login(email, password)
      .pipe(
        tap(data => {
          this.setUser(data);
        }),
        map(userResponse => new User({ // Transformation de UserResponse en User
          email: userResponse.email,
          roles: userResponse.roles
        })),
        catchError(error => {

          let errorMessage = 'Une erreur est survenue lors de la connexion.';

          if (error.status === 0) {
            errorMessage = 'Impossible de se connecter au serveur. Veuillez vérifier votre connexion internet.';
          } else if (error.status === 401) {
            errorMessage = 'Identifiants incorrects. Veuillez vérifier votre email et votre mot de passe.';
          } else if (error.status === 500) {
            errorMessage = 'Le serveur rencontre un problème. Veuillez réessayer plus tard.';
          }

          return throwError(() => new Error(errorMessage));

        })
      );
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

  public refreshToken(): Observable<boolean> {

    return this.authEndpoint.refreshToken()
      .pipe(
        tap(user => {
          this.setUser(user);
        }),
        map(() => this.isLoggedIn()),
        catchError(error => {

          console.error('Refresh failed', error);

          this.userInfoSubject.next(null);
          this.isAuthenticatedSubject.next(false);

          return throwError(() => error);
        })
      );
  }

  public logout(): Observable<void> {
    return this.authEndpoint.logout()
      .pipe(map(() => {
        this.userInfoSubject.next(null);
        this.isAuthenticatedSubject.next(false);
      }),
        catchError(err => {
          console.error(err);
          return throwError(() => err)
        }));
  }

  public isLoggedIn(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  public isAuthenticated(): Observable<boolean> {
    return this.authEndpoint.isAuthenticated();
  }
}
