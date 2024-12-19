import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services';
import { AuthStateService } from '../services/auth-state.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService); // Injection de AuthService
  const authStateService = inject(AuthStateService);
  // Clone the request to ensure withCredentials is enabled
  const clonedReq = req.clone({ withCredentials: true });

  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/login')) {
        // Handle 401 errors and refresh the token
        return handle401Error(req, next, authService);
      }
      return throwError(() => error); // Pass other errors as-is
    })
  );

  function handle401Error(
    request: HttpRequest<any>,
    next: HttpHandlerFn,
    authService: AuthService,
  ): Observable<any> {
    console.log('handle401Error', request);

    // Ensure only one refresh token request at a time
    if (authStateService.isLoggedIn() && authService.isRefreshing) {
      authService.isRefreshing = true;
      console.log('refreshToken interceptor');
      return authService.refreshToken().pipe(
        switchMap(() => {
          authService.isRefreshing = false;
          return next(request); // Retry the original request
        }),
        catchError((error) => {
          console.log('error refreshToken', error);
          authService.isRefreshing = false;
          authService.logout(); // Handle token refresh errors by logging out
          return throwError(() => error);
        })
      );
    }
    return next(request); // Continue if already refreshing or not logged in
  };
}
