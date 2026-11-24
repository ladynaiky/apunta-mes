import { dueLabel, greeting, longDate, monthTitle, shortDay, weekDays, weekTitle } from './dates-ca';

describe('dates-ca', () => {
  it('fechas largas del diseño', () => {
    expect(longDate('2026-11-04')).toBe('Dimecres 4 de novembre');
    expect(monthTitle('2026-11')).toBe('Novembre 2026');
    expect(shortDay('2026-11-06')).toBe('dv. 6');
  });

  it('semana de dilluns a diumenge', () => {
    expect(weekDays('2026-11-04')[0]).toBe('2026-11-02');
    expect(weekTitle('2026-11-04')).toBe('Setmana del 2 al 8 de novembre');
    expect(weekTitle('2026-12-02')).toBe('Setmana del 30 de novembre al 6 de desembre');
  });

  it('apóstrofos: d’octubre, a l’1', () => {
    expect(dueLabel('2026-10-01', '2026-11-04')).toBe('Per a l’1 d’octubre');
    expect(dueLabel('2026-11-12', '2026-11-04')).toBe('Per al 12 de novembre');
    expect(dueLabel('2026-11-04', '2026-11-04')).toBe('Per a avui');
  });

  it('saludo', () => {
    expect(greeting(9)).toBe('Bon dia!');
    expect(greeting(15)).toBe('Bona tarda!');
    expect(greeting(22)).toBe('Bona nit!');
  });
});
