import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthStoreService } from '../services/auth/auth-store.service';


@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authService: AuthStoreService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // Clone the request to ensure withCredentials is enabled
    const clonedReq = req.clone({ withCredentials: true });

    return next.handle(clonedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !req.url.includes('/login')) {
          // Handle 401 errors and refresh the token
          return this.handle401Error(req, next);
        }
        return throwError(() => error); // Pass other errors as-is
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    // Ensure only one refresh token request at a time
    if (this.authService.isLoggedIn() && !this.authService.isRefreshing) {
      this.authService.isRefreshing = true;

      return this.authService.refreshToken().pipe(
        switchMap(() => {

          this.authService.isRefreshing = false;

          // Clone the original request to ensure withCredentials is enabled
          const clonedRequest = request.clone({ withCredentials: true });
          return next.handle(clonedRequest); // Retry the modified request
        }),
        catchError((error) => {
          this.authService.isRefreshing = false;
          this.authService.logout(); // Handle token refresh errors by logging out
          return throwError(() => error);
        })
      );
    }

    // Continue with the next handler if already refreshing or not logged in
    return next.handle(request);
  }
}
