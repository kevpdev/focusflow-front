import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AuthStoreService } from '../services';
import { JwtInterceptor } from './jwt.interceptor';

describe('JWT Interceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let authServiceMock: Partial<AuthStoreService>;

  beforeEach(() => {
    authServiceMock = {
      isLoggedIn: jest.fn().mockReturnValue(true),
      isRefreshing: false,
      refreshToken: jest.fn().mockReturnValue(of(true)),
      logout: jest.fn(),
    };


    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        {
          provide: HTTP_INTERCEPTORS,
          useClass: JwtInterceptor,
          multi: true,
        },
        { provide: AuthStoreService, useValue: authServiceMock },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add withCredentials to the request', () => {
    const testUrl = '/test';

    http.get(testUrl).subscribe();

    // Capture la requête avec un critère souple
    const req = httpMock.expectOne('/test');

    // Vérifie que `withCredentials` est ajouté
    expect(req.request.withCredentials).toBe(true);
    req.flush({});
  });




  it('should handle 401 error and refresh token', () => {
    jest.spyOn(authServiceMock, 'refreshToken').mockReturnValue(of(true));

    http.get('/test').subscribe();
    const req = httpMock.expectOne('/test');

    // Simule une erreur 401
    req.flush({}, { status: 401, statusText: 'Unauthorized' });

    // Vérifie que `refreshToken` a été appelé
    expect(authServiceMock.refreshToken).toHaveBeenCalled();

    // Vérifie que la requête initiale a été relancée après le refresh
    const retryReq = httpMock.expectOne('/test');
    expect(retryReq.request.withCredentials).toBe(true);
    retryReq.flush({});
  });


  it('should log out if token refresh fails', () => {
    jest.spyOn(authServiceMock, 'refreshToken').mockReturnValue(throwError(() => new Error('Refresh token failed')));

    http.get('/test').subscribe({
      error: (err) => {
        expect(err.message).toBe('Refresh token failed');
      },
    });

    const req = httpMock.expectOne('/test');

    // Simule une erreur 401
    req.flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(authServiceMock.logout).toHaveBeenCalled();
  });
});
