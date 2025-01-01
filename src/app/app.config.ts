import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, LOCALE_ID, provideZoneChangeDetection, } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { jwtInterceptor } from '../core/interceptors/jwt.interceptor';
import { AuthStoreService } from '../core/services/auth/auth-store.service';
import { AuthStoreServiceMock } from '../core/services/mocks/auth-store.service.mock';
import { TaskStoreServiceMock } from '../core/services/mocks/task-store.service.mock';
import { TaskStoreService } from '../core/services/task/task-store.service';
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
      provide: AuthStoreService,
      useClass: environment.useMocks ? AuthStoreServiceMock : AuthStoreService
    },
    {
      provide: TaskStoreService,
      useClass: environment.useMocks ? TaskStoreServiceMock : TaskStoreService
    },
    { provide: LOCALE_ID, useValue: 'fr-FR' },
  ]
};
