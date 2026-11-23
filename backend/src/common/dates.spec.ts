import {
  addDays,
  daysBetween,
  isRealDate,
  monthRange,
  weekRange,
} from './dates.js';

describe('dates', () => {
  it('weekRange: la semana del 4/11/2026 va del dilluns 2 al diumenge 8', () => {
    expect(weekRange('2026-11-04')).toEqual({
      from: '2026-11-02',
      to: '2026-11-08',
    });
    expect(weekRange('2026-11-02')).toEqual({
      from: '2026-11-02',
      to: '2026-11-08',
    });
    expect(weekRange('2026-11-08')).toEqual({
      from: '2026-11-02',
      to: '2026-11-08',
    });
  });

  it('monthRange: novembre té 30 dies i febrer de 2028, 29', () => {
    expect(monthRange('2026-11')).toEqual({
      from: '2026-11-01',
      to: '2026-11-30',
    });
    expect(monthRange('2028-02').to).toBe('2028-02-29');
  });

  it('addDays i daysBetween canvien de mes i d’any', () => {
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(daysBetween('2026-11-04', '2026-11-13')).toBe(9);
  });

  it('isRealDate descarta dates que no existeixen', () => {
    expect(isRealDate('2026-11-30')).toBe(true);
    expect(isRealDate('2026-11-31')).toBe(false);
    expect(isRealDate('4/11/2026')).toBe(false);
  });
});
