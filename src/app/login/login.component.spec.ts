import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthEndpoint } from '../../core/endpoints';
import { AuthService, AuthStateService } from '../../core/services';
import { testProviders } from '../app.test.config';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authEndpointMock: jest.Mocked<AuthEndpoint>;
  let authStateServiceMock: jest.Mocked<AuthStateService>;

  beforeEach(async () => {

    authEndpointMock = {
      login: jest.fn(),
      refreshToken: jest.fn(),
      logout: jest.fn(),
      isAuthenticated: jest.fn(),
    } as Partial<AuthEndpoint> as jest.Mocked<AuthEndpoint>;

    authStateServiceMock = {
      setUser: jest.fn(),
      isLoggedIn: jest.fn(),
      userInfoSubject: { next: jest.fn() } as any,
      isAuthenticatedSubject: { next: jest.fn() } as any,
    } as Partial<AuthStateService> as jest.Mocked<AuthStateService>;

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        ...testProviders,
        AuthService]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
