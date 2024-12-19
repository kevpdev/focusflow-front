import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of, switchMap, timer } from 'rxjs';
import { AuthService } from '../services';
import { AuthStateService } from '../services/auth-state.service';

export const authGuard: CanActivateFn = (route, state) => {

    const authService = inject(AuthService);
    const authStateService = inject(AuthStateService);
    const router = inject(Router);

    return timer(500).pipe( // Ajoute un délai de 100 ms
        switchMap(() => {
            console.log('isAuthenticated guard');
            return authService.isAuthenticated()
        }),
        map(() => {
            authStateService.isAuthenticatedSubject.next(true);
            return true
        }),
        catchError((error) => {
            console.error("the user is not authenticated !", error);
            return authService.refreshToken().pipe(
                map(() => true),
                catchError((err => {
                    // refreh token expirated
                    console.error("The refresh token has expirated !", err);
                    router.navigate(['/login'])
                    return of(false);

                }))
            )
        })
    );



};
