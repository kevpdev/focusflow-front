import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, LOCALE_ID, provideZoneChangeDetection, } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { jwtInterceptor } from '../core/interceptors/jwt.interceptor';
import { AuthService } from '../core/services/auth.service';
import { AuthServiceMock } from '../core/services/mocks/auth.service.mock';
import { TaskServiceMock } from '../core/services/mocks/task.service.mock';
import { TaskService } from '../core/services/task.service';
import { environment } from '../environments/environment';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), provideHttpClient(
      withInterceptors([jwtInterceptor])
    ), provideAnimationsAsync(),
    provideNativeDateAdapter(),
    {
      provide: AuthService,
      useClass: environment.useMocks ? AuthServiceMock : AuthService
    },
    {
      provide: TaskService,
      useClass: environment.useMocks ? TaskServiceMock : TaskService
    },
    { provide: LOCALE_ID, useValue: 'fr-FR' },
  ]
};
