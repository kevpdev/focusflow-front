import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { UserResponse } from '../../models/user-response.model';
import { User } from '../../models/user.model';
import { AuthApiService } from './auth-api.service';
import { AuthStoreService } from './auth-store.service';

describe('AuthStoreService', () => {
  let service: AuthStoreService;
  let authApiMock: jest.Mocked<AuthApiService>;
  let mockUserResponse: UserResponse;
  let mockUser: User;

  beforeEach(() => {
    // Mock pour AuthApiService
    authApiMock = {
      login: jest.fn().mockReturnValue(of({ email: 'test@example.com', roles: ['USER'] })),
      refreshToken: jest.fn().mockReturnValue(of({ email: 'test@example.com', roles: ['USER'] })),
      logout: jest.fn().mockReturnValue(of(void 0)),
      isAuthenticated: jest.fn().mockReturnValue(of(true)),
    } as Partial<AuthApiService> as jest.Mocked<AuthApiService>;

    // Initialisation des valeurs mockées
    mockUserResponse = new UserResponse({ email: 'test@example.com', roles: ['USER'] });
    mockUser = new User({ email: 'test@example.com', roles: ['USER'] });

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthApiService, useValue: authApiMock },
        AuthStoreService,
      ],
    });

    service = TestBed.inject(AuthStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be isAuthenticated created', () => {
    expect(service.isAuthenticated()).toBeTruthy();
  });


  it('should log in the user and update state', (done) => {
    service.login('test@example.com', 'password').subscribe(user => {
      expect(user).toEqual(mockUser);
      expect(service.userInfoSubject.value?.email).toBe('test@example.com');
      expect(authApiMock.login).toHaveBeenCalledWith('test@example.com', 'password');
      done();
    });

  });

  it('should handle login error (status 401)', (done) => {
    authApiMock.login.mockReturnValue(throwError(() => ({ status: 401 })));
    service.login('test@example.com', 'password').subscribe({
      error: err => {
        expect(err.message).toBe('Identifiants incorrects. Veuillez vérifier votre email et votre mot de passe.');
        expect(authApiMock.login).toHaveBeenCalledWith('test@example.com', 'password');
        done();
      }
    });

  });

  it('should handle login error (status 0)', (done) => {

    authApiMock.login.mockReturnValue(throwError(() => ({ status: 0 })));
    service.login('test@example.com', 'password').subscribe({
      error: err => {
        expect(err.message).toBe('Impossible de se connecter au serveur. Veuillez vérifier votre connexion internet.');
        expect(authApiMock.login).toHaveBeenCalledWith('test@example.com', 'password');
        done();
      }
    });

  });

  it('should handle login error (status 500)', (done) => {
    authApiMock.login.mockReturnValue(throwError(() => ({ status: 500 })));
    service.login('test@example.com', 'password').subscribe({
      error: err => {
        expect(err.message).toBe('Le serveur rencontre un problème. Veuillez réessayer plus tard.');
        expect(authApiMock.login).toHaveBeenCalledWith('test@example.com', 'password');
        done();
      }
    });

  });


  it('should return true after refreshToken', (done) => {
    service.refreshToken().subscribe(() => {
      expect(service.userInfoSubject.value?.email).toBe('test@example.com');
      expect(authApiMock.refreshToken).toHaveBeenCalled();
      done();
    });

  });

  it('should handle refreshToken error', (done) => {
    const error = new Error('refresh failed');
    authApiMock.refreshToken.mockReturnValue(throwError(() => error));

    service.refreshToken()
      .subscribe({
        next: () => {
          fail('Expected an error, but got a response');
        },
        error: err => {
          expect(err.message).toBe('refresh failed');
          expect(service.isAuthenticatedSubject.value).toBeFalsy();
          expect(service.userInfoSubject.value).toBeNull();
          expect(authApiMock.refreshToken).toHaveBeenCalled();
          done();
        }
      });

  });


  it('should log out', (done) => {
    service.logout().subscribe(result => {
      expect(result).toBeTruthy();
      expect(service.userInfoSubject.value).toBeNull();
      expect(service.isAuthenticatedSubject.value).toBeFalsy();
      expect(authApiMock.logout).toHaveBeenCalled();
      done();
    });

  });

  it('should handle log out error', (done) => {
    authApiMock.logout.mockReturnValue(throwError(() => new Error()));
    service.logout()
      .subscribe({
        next: () => {
          fail('Expected an error, but got a response');
        },
        error: err => {
          expect(err.message).toBe('Un problème est survenue lors de la tentative de déconnexion.');
          expect(service.isAuthenticatedSubject.value).toBeFalsy();;
          expect(authApiMock.logout).toHaveBeenCalled();
          done();
        }
      });

  });

});
