import { computed, signal, Signal } from '@angular/core';
import { apiErrors } from '../../i18n/ca';

/**
 * Cuándo se enseña el error de un campo (igual que en la alta fidelidad):
 * después de pulsar el botón, o cuando el campo ya tiene algo escrito.
 * Los errores de la API (por campo) se borran al volver a escribir en él.
 */
export class FormState<F extends string> {
  readonly tried = signal(false);
  readonly serverErrors = signal<Partial<Record<F, string>>>({});
  /** Error general de la API (credenciales, red…). */
  readonly formError = signal<string | null>(null);
  readonly sending = signal(false);

  constructor(
    private readonly fields: Record<F, { value: Signal<unknown>; validate: () => string | null }>,
  ) {}

  /** Mensaje a mostrar en un campo (o null). */
  error(field: F): Signal<string | null> {
    return computed(() => {
      const server = this.serverErrors()[field];
      if (server) return server;
      const code = this.fields[field].validate();
      const value = this.fields[field].value();
      const visible = this.tried() || (value !== '' && value !== null);
      return code && visible ? apiErrors[code] : null;
    });
  }

  readonly valid = computed(() =>
    (Object.keys(this.fields) as F[]).every((f) => !this.fields[f].validate()),
  );

  /** El usuario ha vuelto a escribir en un campo: fuera los errores de la API. */
  edited(field: F): void {
    if (this.serverErrors()[field]) {
      const next = { ...this.serverErrors() };
      delete next[field];
      this.serverErrors.set(next);
    }
    this.formError.set(null);
  }
}
