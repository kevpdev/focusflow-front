import { Injectable } from '@angular/core';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { AuthEndpoint } from '../endpoints';
import { User } from '../models/user.model';
import { AuthStateService } from './auth-state.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  public readonly userStorageId = 'user';
  public isRefreshing = false;

  constructor(private authEndpoint: AuthEndpoint, private authStateService: AuthStateService) { }


  public login(email: string, password: string): Observable<User> {

    return this.authEndpoint.login(email, password)
      .pipe(
        tap(data => {
          this.authStateService.setUser(data);
        }),
        map(userResponse => new User({
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

  /**
   * Retrieves an acces token if refresh token is still valid.
   * Update authentication state.
   */
  public refreshToken(): Observable<boolean> {

    return this.authEndpoint.refreshToken()
      .pipe(
        tap(user => {
          this.authStateService.setUser(user);
        }),
        map(() => this.authStateService.isLoggedIn()),
        catchError(error => {

          console.error('Refresh failed', error);

          this.authStateService.userInfoSubject.next(null);
          this.authStateService.isAuthenticatedSubject.next(false);

          return throwError(() => error);
        })
      );
  }

  public logout(): Observable<void> {
    return this.authEndpoint.logout()
      .pipe(map(() => {
        this.authStateService.userInfoSubject.next(null);
        this.authStateService.isAuthenticatedSubject.next(false);
      }),
        catchError(err => {
          console.error(err);
          return throwError(() => err)
        }));
  }


  public isAuthenticated(): Observable<boolean> {
    return this.authEndpoint.isAuthenticated();
  }
}
