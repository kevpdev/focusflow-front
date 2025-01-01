import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of, switchMap, timer } from 'rxjs';
import { AuthStoreService } from '../services';

export const authGuard: CanActivateFn = (route, state) => {

    const authService = inject(AuthStoreService);
    const router = inject(Router);

    return timer(500).pipe( // Adds a 500 ms delay
        switchMap(() => {
            console.log('isAuthenticated guard');
            return authService.isAuthenticated();
        }),
        map(() => {
            authService.isAuthenticatedSubject.next(true);
            return true
        }),
        catchError((error) => {
            console.error("the user is not authenticated !", error);
            return authService.refreshToken().pipe(
                map(() => true),
                catchError((err => {
                    // refresh token expirated
                    console.error("The refresh token has expirated !", err);
                    router.navigate(['/login'])
                    return of(false);

                }))
            )
        })
    );



};
