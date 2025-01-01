import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthEndpoint } from '../../core/endpoints';
import { AuthStoreService } from '../../core/services';
import { testProviders } from '../app.test.config';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authEndpointMock: jest.Mocked<AuthEndpoint>;

  beforeEach(async () => {

    authEndpointMock = {
      login: jest.fn(),
      refreshToken: jest.fn(),
      logout: jest.fn(),
      isAuthenticated: jest.fn(),
    } as Partial<AuthEndpoint> as jest.Mocked<AuthEndpoint>;

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        ...testProviders,
        AuthStoreService]
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
