import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';

import { Observable, of, throwError } from 'rxjs';
import { AuthStoreService } from '../services/auth/auth-store.service';
import { authGuard } from './auth.guard';

describe('AuthGuard', () => {
  let authServiceMock: Partial<AuthStoreService>;
  let routerMock: Partial<Router>;
  let routeMock: ActivatedRouteSnapshot;
  let stateMock: RouterStateSnapshot;

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  beforeEach(() => {
    authServiceMock = {
      isAuthenticated: jest.fn(),
      refreshToken: jest.fn(),
      isAuthenticatedSubject: {
        next: jest.fn(),
      } as any,
    };

    routerMock = {
      navigate: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthStoreService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    routeMock = {} as any;; // Simule un objet ActivatedRouteSnapshot
    stateMock = { url: '/dashboard' } as any; // Simule un objet RouterStateSnapshot

  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should return true if the user is authenticated', (done) => {
    jest.spyOn(authServiceMock, 'isAuthenticated').mockReturnValue(of(true));

    const result = executeGuard(routeMock, stateMock) as Observable<boolean>;

    result.subscribe((res) => {
      expect(res).toBe(true);
      done();
    });
  });

  it('should return refresh token true if the user is not authenticated', (done) => {
    jest.spyOn(authServiceMock, 'isAuthenticated').mockReturnValue(throwError(() => new Error()));
    jest.spyOn(authServiceMock, 'refreshToken').mockReturnValue(of(true));

    const result = executeGuard(routeMock, stateMock) as Observable<boolean>;

    result.subscribe((result) => {
      expect(result).toBe(true);
      expect(authServiceMock.refreshToken).toHaveBeenCalled();
      done();
    });

  });

  it('should redirect to login page if refresh token fails', (done) => {
    jest.spyOn(authServiceMock, 'isAuthenticated').mockReturnValue(throwError(() => new Error()));
    jest.spyOn(authServiceMock, 'refreshToken').mockReturnValue(throwError(() => new Error()));

    const result = executeGuard(routeMock, stateMock) as Observable<boolean>;

    result.subscribe((result) => {
      expect(result).toBe(false);
      expect(authServiceMock.refreshToken).toHaveBeenCalled();
      expect(routerMock.navigate).toHaveBeenCalled();
      done();
    });

  });



});
