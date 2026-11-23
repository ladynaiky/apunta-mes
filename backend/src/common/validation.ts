import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';

/**
 * Errores de validación con un formato fijo y fácil de leer desde cualquier
 * frontend (Ionic o nativo):
 *   { statusCode: 400, code: 'VALIDATION_ERROR', errors: { email: 'email.invalid' } }
 * Cada campo lleva un código de error (no un texto). El frontend traduce el
 * código al mensaje en catalán del diseño, que vive en un solo sitio.
 */
function flatten(
  errors: ValidationError[],
  parent = '',
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const e of errors) {
    const path = parent ? `${parent}.${e.property}` : e.property;
    const first = Object.values(e.constraints ?? {})[0];
    if (first) out[path] = first;
    if (e.children?.length) Object.assign(out, flatten(e.children, path));
  }
  return out;
}

export function createValidationPipe(): ValidationPipe {
  return new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    stopAtFirstError: true,
    exceptionFactory: (errors) =>
      new BadRequestException({
        statusCode: 400,
        code: 'VALIDATION_ERROR',
        errors: flatten(errors),
      }),
  });
}
