import { HttpErrorResponse } from '@angular/common/http';
import { apiErrors } from '../../i18n/ca';

/**
 * Error de la API ya traducido. La API envía códigos (CLAUDE.md, 2.7b):
 *   { code: 'VALIDATION_ERROR', errors: { email: 'email.invalid' } }
 *   { code: 'INVALID_CREDENTIALS' }
 */
export interface ApiError {
  /** Código general (VALIDATION_ERROR, EMAIL_TAKEN…, NETWORK, SERVER). */
  code: string;
  /** Mensaje general en catalán. */
  message: string;
  /** Mensajes por campo, ya traducidos. */
  fields: Record<string, string>;
}

export function translateCode(code: string): string {
  return apiErrors[code] ?? apiErrors['SERVER'];
}

export function toApiError(error: unknown): ApiError {
  if (!(error instanceof HttpErrorResponse)) {
    return { code: 'SERVER', message: translateCode('SERVER'), fields: {} };
  }
  if (error.status === 0) {
    return { code: 'NETWORK', message: translateCode('NETWORK'), fields: {} };
  }
  const body = (error.error ?? {}) as { code?: string; errors?: Record<string, string> };
  const code = body.code ?? (error.status >= 500 ? 'SERVER' : `HTTP_${error.status}`);
  const fields = Object.fromEntries(
    Object.entries(body.errors ?? {}).map(([field, fieldCode]) => [field, translateCode(fieldCode)]),
  );
  return { code, message: translateCode(code), fields };
}
