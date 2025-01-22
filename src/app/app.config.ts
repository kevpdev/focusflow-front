import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, LOCALE_ID, provideZoneChangeDetection, } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { dateConversionInterceptor } from 'src/core/interceptors/date-conversion.interceptor';
import { JwtInterceptor } from '../core/interceptors/jwt.interceptor';
import { AuthStoreService } from '../core/services/auth/auth-store.service';
import { AuthStoreServiceMock } from '../core/services/mocks/auth-store.service.mock';
import { TaskStoreServiceMock } from '../core/services/mocks/task-store.service.mock';
import { TaskStoreService } from '../core/services/task/task-store.service';
import { TranslationService } from '../core/services/translation.service';
import { environment } from '../environments/environment';
import { routes } from './app.routes';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function initializeTranslation(translationService: TranslationService) {
  return () => translationService; // La logique d'initialisation est déjà dans le constructeur
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), provideHttpClient(
      withInterceptorsFromDi(),
      withInterceptors([dateConversionInterceptor])
    ),
    provideAnimationsAsync(),
    provideNativeDateAdapter(),
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    {
      provide: AuthStoreService,
      useClass: environment.useMocks ? AuthStoreServiceMock : AuthStoreService
    },
    {
      provide: TaskStoreService,
      useClass: environment.useMocks ? TaskStoreServiceMock : TaskStoreService
    },
    { provide: LOCALE_ID, useValue: 'fr-FR' },
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      })
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeTranslation,
      deps: [TranslationService],
      multi: true,
    },
  ]
};
