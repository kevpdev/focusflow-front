import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  defaultLang = 'fr';

  constructor(
    private translateService: TranslateService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const savedLang = localStorage.getItem('lng');
      if (savedLang) {
        this.defaultLang = savedLang;
      }
      this.translateService.setDefaultLang(this.defaultLang);
      this.translateService.use(this.defaultLang);
    }
  }

  changeLang(lang: string) {
    this.translateService.use(lang);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('lng', lang);
    }
  }

  instant(key: string): string {
    return this.translateService.instant(key);
  }

  getTranslationsToSignal(keys: string[]): Signal<string[]> {
    return toSignal(this.translateService.stream(keys), {
      initialValue: this.translateService.instant(keys),
    });
  }

  getTranslationToSignal(key: string): Signal<string> {
    return toSignal(this.translateService.stream(key), {
      initialValue: this.translateService.instant(key),
    });
  }
}
