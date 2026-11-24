import {
  validateEmail,
  validateLoginPassword,
  validateName,
  validateNewPassword,
  validateRepeatPassword,
  validateRole,
} from './validators';

describe('validators (mismos códigos que la API)', () => {
  it('nom', () => {
    expect(validateName('  ')).toBe('name.required');
    expect(validateName('Laia')).toBeNull();
    expect(validateName('x'.repeat(61))).toBe('name.maxLength');
  });

  it('correu', () => {
    expect(validateEmail('')).toBe('email.required');
    expect(validateEmail('nom@exemple')).toBe('email.invalid');
    expect(validateEmail(' nom@exemple.cat ')).toBeNull();
  });

  it('contrasenya', () => {
    expect(validateLoginPassword('')).toBe('password.required');
    expect(validateNewPassword('1234567')).toBe('password.minLength');
    expect(validateNewPassword('12345678')).toBeNull();
    expect(validateRepeatPassword('', 'a')).toBe('password2.required');
    expect(validateRepeatPassword('b', 'a')).toBe('password.mismatch');
    expect(validateRepeatPassword('a', 'a')).toBeNull();
  });

  it('rol', () => {
    expect(validateRole(null)).toBe('role.required');
    expect(validateRole('student')).toBeNull();
  });
});
