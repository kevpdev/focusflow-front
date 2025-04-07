import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs';

export const dateConversionInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    map(event => {
      if (event instanceof HttpResponse) {
        return event.clone({ body: convertDates(event.body) });
      }
      return event;
    })
  );
};

/**
 * Convertit récursivement les dates au format ISO en objets Date
 * @param body Réponse de l'API
 * @returns Retoune le body avec les dates string converti en objet Date
 */
function convertDates(body: any): any {
  if (!body || typeof body !== 'object') {
    return body;
  }

  if (Array.isArray(body)) {
    return body.map(item => convertDates(item));
  }

  return Object.keys(body).reduce((acc, key) => {
    const value = body[key];

    if (isIsoDate(value)) {
      acc[key] = new Date(value); // Conversion des chaînes ISO en Date
    } else if (typeof value === 'object') {
      acc[key] = convertDates(value); // Conversion récursive pour les objets imbriqués
    } else {
      acc[key] = value;
    }

    return acc;
  }, {} as any);
}

/**
 * Vérifie si une chaîne correspond au format ISO 8601
 * @param value
 * @returns un bouleen
 */
function isIsoDate(value: any): boolean {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d+)?Z$/.test(value);
}
