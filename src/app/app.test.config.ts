import { provideHttpClient } from "@angular/common/http";
import { provideNativeDateAdapter } from "@angular/material/core";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";

export const testProviders = [
    provideHttpClient(),           // Fournit HttpClient
    provideAnimationsAsync(),           // Fournit les animations
    provideNativeDateAdapter()
];