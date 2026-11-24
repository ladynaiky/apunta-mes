import { HttpErrorResponse } from '@angular/common/http';
import { toApiError } from './api-error';

describe('toApiError', () => {
  it('traduce los errores por campo', () => {
    const e = toApiError(
      new HttpErrorResponse({
        status: 400,
        error: { code: 'VALIDATION_ERROR', errors: { email: 'email.invalid' } },
      }),
    );
    expect(e.fields).toEqual({ email: 'Format de correu no vàlid (ex.: nom@exemple.cat).' });
  });

  it('credenciales incorrectas, sin conexión y error del servidor', () => {
    expect(toApiError(new HttpErrorResponse({ status: 401, error: { code: 'INVALID_CREDENTIALS' } })).message).toContain(
      'no són correctes',
    );
    expect(toApiError(new HttpErrorResponse({ status: 0 })).code).toBe('NETWORK');
    expect(toApiError(new HttpErrorResponse({ status: 500 })).code).toBe('SERVER');
  });
});
