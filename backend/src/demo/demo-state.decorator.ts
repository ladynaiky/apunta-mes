import { SetMetadata } from '@nestjs/common';

export const DEMO_EMPTY_KEY = 'demoEmptyValue';

/**
 * Marca un endpoint de lectura para el modo demo. Con DEMO_MODE=true y la
 * cabecera X-Demo-State:
 *  - empty → devuelve `emptyValue` (por defecto, una lista vacía);
 *  - error → 503 { code: 'DEMO_ERROR' }.
 * Sirve para enseñar los estados «buit» y «error» del diseño.
 */
export const DemoState = (emptyValue: unknown = []) =>
  SetMetadata(DEMO_EMPTY_KEY, { emptyValue });
