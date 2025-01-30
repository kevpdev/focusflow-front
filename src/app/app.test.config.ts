import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { provideNativeDateAdapter } from "@angular/material/core";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";

export const testProviders = [
    provideHttpClient(),           // Fournit HttpClient
    provideHttpClientTesting(),
    provideAnimationsAsync(),           // Fournit les animations
    provideNativeDateAdapter()
];