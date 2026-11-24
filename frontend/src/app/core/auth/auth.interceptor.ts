import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { apiErrors } from '../../i18n/ca';
import { SnackbarService } from '../../shared/components/snackbar/snackbar.service';
import { AuthService } from './auth.service';

/** Rutas donde un 401 es una respuesta normal (credenciales), no una sesión caducada. */
const AUTH_ENDPOINTS = ['/auth/login', '/auth/register'];

/**
 * - Añade el token a las llamadas a nuestra API.
 * - Si la API responde 401 (token caducado o falso): cierra la sesión,
 *   avisa y vuelve a Iniciar sessió.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const snackbar = inject(SnackbarService);

  const isApi = req.url.startsWith(environment.apiUrl);
  const token = auth.token();
  const request = isApi && token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(request).pipe(
    catchError((err: unknown) => {
      const isAuthCall = AUTH_ENDPOINTS.some((p) => req.url.endsWith(p));
      if (isApi && !isAuthCall && token && err instanceof HttpErrorResponse && err.status === 401) {
        void auth.logout().then(() => {
          snackbar.show(apiErrors['UNAUTHORIZED']);
          void router.navigateByUrl('/login', { replaceUrl: true });
        });
      }
      return throwError(() => err);
    }),
  );
};
