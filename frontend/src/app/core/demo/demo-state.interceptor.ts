import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { DemoStateService } from './demo-state.service';

/** Rutas que nunca se fuerzan (si no, no se podría ni entrar en la app). */
const NEVER = ['/config', '/health', '/auth/'];

/**
 * Añade `X-Demo-State: empty|error` a las lecturas (GET) de nuestra API.
 * El backend solo lo tiene en cuenta con DEMO_MODE=true.
 */
export const demoStateInterceptor: HttpInterceptorFn = (req, next) => {
  const state = inject(DemoStateService).state();
  const path = req.url.replace(environment.apiUrl, '');
  const applies =
    state !== 'normal' &&
    req.method === 'GET' &&
    req.url.startsWith(environment.apiUrl) &&
    !NEVER.some((p) => path.startsWith(p));
  return next(applies ? req.clone({ setHeaders: { 'X-Demo-State': state } }) : req);
};
