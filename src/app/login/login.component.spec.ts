import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { AuthStoreService } from '../../core/services';
import { AuthApiService } from '../../core/services/auth/auth-api.service';
import { testProviders } from '../app.test.config';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authEndpointMock: jest.Mocked<AuthApiService>;

  beforeEach(async () => {
    authEndpointMock = {
      login: jest.fn(),
      refreshToken: jest.fn(),
      logout: jest.fn(),
      isAuthenticated: jest.fn(),
    } as Partial<AuthApiService> as jest.Mocked<AuthApiService>;

    await TestBed.configureTestingModule({
      imports: [LoginComponent, TranslateModule.forRoot()],
      providers: [...testProviders, AuthStoreService],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
