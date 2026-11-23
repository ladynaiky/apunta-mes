import { apiErrors, ca } from './ca';

describe('ca (textos)', () => {
  it('traduce los códigos de error de la API a los textos del diseño', () => {
    expect(apiErrors['email.invalid']).toBe('Format de correu no vàlid (ex.: nom@exemple.cat).');
    expect(apiErrors['password.minLength']).toBe('Ha de tenir almenys 8 caràcters.');
  });

  it('singular y plural del aviso del perfil', () => {
    expect(ca.topBar.meWithPending(1)).toBe('El meu espai: 1 tasca pendent per a avui');
    expect(ca.topBar.meWithPending(3)).toBe('El meu espai: 3 tasques pendents per a avui');
  });
});
