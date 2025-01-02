import { provideHttpClient } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { environment } from "../../../environments/environment.development";
import { UserRequest, UserResponse } from "../../models";
import { AuthApiService } from "./auth-api.service";

let service: AuthApiService;
let httpTesting: HttpTestingController;
let apiUrl: String;

describe('authApiService', () => {

    beforeEach(() => {

        //Injection
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        });

        service = TestBed.inject(AuthApiService);
        httpTesting = TestBed.inject(HttpTestingController);
        apiUrl = environment.apiURL;

    });

    afterEach(() => {
        httpTesting.verify();
    })

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should perform login', () => {
        const userRequestBody = new UserRequest({ email: 'toto@gmail.com', password: 'password' });
        const mockResponse = new UserResponse({ email: 'toto@gmail.com', roles: ['USER'] });

        service.login(userRequestBody.email, userRequestBody.password)
            .subscribe(userResponse => {

                expect(userResponse).toEqual(mockResponse); // Vérifie la réponse de l'API
            });

        const req = httpTesting.expectOne(`${apiUrl}auth/login`);
        expect(req.request.method).toBe('POST'); // Vérifie la méthode HTTP
        expect(req.request.body).toEqual(userRequestBody); // Vérifie le corps de la requête
        req.flush(mockResponse); // Simule la réponse de l'API
    });

    it('should refresh token', () => {
        const mockResponse = new UserResponse({ email: 'toto@gmail.com', roles: ['USER'] });

        service.refreshToken()
            .subscribe(userResponse => {
                expect(userResponse).toEqual(mockResponse); // Vérifie la réponse de l'API
            });

        const req = httpTesting.expectOne(`${apiUrl}auth/refresh`);
        expect(req.request.method).toBe('POST'); // Vérifie la méthode HTTP
        expect(req.request.body).toEqual({}); // Vérifie que le corps de la requête est vide
        req.flush(mockResponse); // Simule la réponse de l'API
    });

    it('should check if authenticated', () => {
        const mockResponse = true;

        service.isAuthenticated()
            .subscribe(isAuth => {
                expect(isAuth).toBe(mockResponse); // Vérifie la réponse de l'API
            });

        const req = httpTesting.expectOne(`${apiUrl}auth/isAuthenticated`);
        expect(req.request.method).toBe('GET'); // Vérifie la méthode HTTP
        req.flush(mockResponse); // Simule la réponse de l'API
    });

    it('should logout', () => {
        service.logout()
            .subscribe(() => {
                expect(true).toBe(true); // Juste pour confirmer que le flux s'est terminé
            });

        const req = httpTesting.expectOne(`${apiUrl}auth/logout`);
        expect(req.request.method).toBe('POST'); // Vérifie la méthode HTTP
        expect(req.request.body).toEqual({}); // Vérifie que le corps de la requête est vide
        req.flush(null); // Simule une réponse vide pour un logout
    });

});

