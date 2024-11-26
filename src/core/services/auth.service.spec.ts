import { TestBed } from '@angular/core/testing';

import { AuthEndpoint } from '../endpoints/auth.endpoint';
import { AuthService } from './auth.service';

describe('AuthService', () => {

  // inititialisation
  let service: AuthService;
  let endpointSpy: jasmine.SpyObj<AuthEndpoint>;
  const mockAuthEndpoint = jasmine.createSpyObj('AutEndpoint', ['login']) as jasmine.SpyObj<AuthEndpoint>;

  beforeEach(() => {

    //Spy
    
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: AuthEndpoint, useValue: mockAuthEndpoint },
      ],
    });
    
    // Injection
    service = TestBed.inject(AuthService);
  

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // it('should call the endpoint login method', () => {
  //   const mockUserCredentials = {email : 'dupont@gmail.com', password: '123456'}
  //   const mockResponse = {token: 'fake-token'};

  //   //mock call login method endpoint
  //   mockAuthEndpoint.login.and.returnValue(of(mockResponse));
  
  //   //C
  //   service.login(mockUserCredentials.email, mockUserCredentials.password)
  //   .subscribe(data => {
  //     expect(data).toEqual(mockResponse);
  //     expect(mockAuthEndpoint.login).toHaveBeenCalledWith(mockUserCredentials.email, mockUserCredentials.password);
  //   });

  // });

  
});
