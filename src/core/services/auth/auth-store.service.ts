import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { UserResponse } from '../../models/user-response.model';
import { User } from '../../models/user.model';
import { AuthApiService } from './auth-api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthStoreService {


  public readonly userStorageId = 'user';
  public isRefreshing = false;
  public userInfoSubject = new BehaviorSubject<User | null>(null);
  public readonly userInfo$ = this.userInfoSubject.asObservable();
  public isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public readonly isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private authApiService: AuthApiService) { }


  public login(email: string, password: string): Observable<User> {

    return this.authApiService.login(email, password)
      .pipe(
        map(userResponse => {

          this.setUser(userResponse);

          const user = new User({
            email: userResponse.email,
            roles: userResponse.roles
          });

          return user;

        }),
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

  /**
   * Retrieves an acces token if refresh token is still valid.
   * Update authentication state.
   */
  public refreshToken(): Observable<boolean> {

    return this.authApiService.refreshToken()
      .pipe(
        map(user => {
          this.setUser(user);
          return this.isLoggedIn();
        }),
        catchError(error => {

          console.error('Refresh failed', error);

          this.userInfoSubject.next(null);
          this.isAuthenticatedSubject.next(false);

          return throwError(() => error);
        })
      );
  }

  public logout(): Observable<boolean> {
    return this.authApiService.logout()
      .pipe(
        tap(() => {
          console.log('logout');

          this.userInfoSubject.next(null);
          this.isAuthenticatedSubject.next(false);
        }),
        map(() => true),
        catchError(err => {
          let errorMessage = 'Un problème est survenue lors de la tentative de déconnexion.';
          console.error(err);
          return throwError(() => new Error(errorMessage))
        }));
  }


  public isAuthenticated(): Observable<boolean> {
    return this.authApiService.isAuthenticated();
  }


  public setUser(userResponse: UserResponse): void {
    const user = new User(
      {
        email: userResponse.email,
        roles: userResponse.roles
      })

    this.userInfoSubject.next(user);

  }



  public isLoggedIn(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}
