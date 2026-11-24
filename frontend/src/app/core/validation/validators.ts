/**
 * Validaciones del cliente con los mismos códigos que la API. Así los
 * mensajes salen de la misma tabla (`apiErrors`) en los dos casos.
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateName(v: string): string | null {
  if (!v.trim()) return 'name.required';
  return v.trim().length > 60 ? 'name.maxLength' : null;
}

export function validateEmail(v: string): string | null {
  if (!v.trim()) return 'email.required';
  return EMAIL_RE.test(v.trim()) ? null : 'email.invalid';
}

/** Iniciar sessió: solo que no esté vacía. */
export function validateLoginPassword(v: string): string | null {
  return v ? null : 'password.required';
}

/** Registre: mínimo 8 caracteres (y máximo 72, el límite de bcrypt). */
export function validateNewPassword(v: string): string | null {
  if (v.length < 8) return 'password.minLength';
  return v.length > 72 ? 'password.maxLength' : null;
}

export function validateRepeatPassword(v: string, password: string): string | null {
  if (!v) return 'password2.required';
  return v === password ? null : 'password.mismatch';
}

export function validateRole(v: string | null): string | null {
  return v ? null : 'role.required';
}
