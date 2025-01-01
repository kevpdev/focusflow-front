
import { AuthEndpoint } from '../../endpoints';
import { AuthStoreService } from './auth-store.service';

describe('AuthService', () => {

  // inititialisation
  let service: AuthStoreService;
  //const mockAuthEndpoint = jasmine.createSpyObj('AutEndpoint', ['login']) as jasmine.SpyObj<AuthEndpoint>;

  beforeEach(() => {

    //Injection
    let mockAuthEndpoint = {} as jest.Mocked<AuthEndpoint>;
    service = new AuthStoreService(mockAuthEndpoint);


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
