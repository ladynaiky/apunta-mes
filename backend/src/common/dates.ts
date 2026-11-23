/**
 * Fechas de calendario como texto AAAA-MM-DD (sin hora ni zona horaria).
 * Así «4 de novembre» es el mismo día en el servidor, en Atlas y en el móvil.
 */
export const DATE_RE = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
export const MONTH_RE = /^\d{4}-(0[1-9]|1[0-2])$/;
export const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

const toUtc = (date: string) => new Date(`${date}T00:00:00Z`);
const fromUtc = (d: Date) => d.toISOString().slice(0, 10);

export function addDays(date: string, days: number): string {
  const d = toUtc(date);
  d.setUTCDate(d.getUTCDate() + days);
  return fromUtc(d);
}

/** Lunes y domingo de la semana de `date` (la semana empieza en lunes). */
export function weekRange(date: string): { from: string; to: string } {
  const weekday = (toUtc(date).getUTCDay() + 6) % 7; // 0 = dilluns
  const from = addDays(date, -weekday);
  return { from, to: addDays(from, 6) };
}

/** Primer y último día del mes AAAA-MM. */
export function monthRange(month: string): { from: string; to: string } {
  const [y, m] = month.split('-').map(Number);
  const last = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return {
    from: `${month}-01`,
    to: `${month}-${String(last).padStart(2, '0')}`,
  };
}

/** Comprueba que la fecha existe de verdad (descarta el 31 de novembre). */
export function isRealDate(date: string): boolean {
  return DATE_RE.test(date) && fromUtc(toUtc(date)) === date;
}

/** Días entre dos fechas (b - a). */
export function daysBetween(a: string, b: string): number {
  return Math.round((toUtc(b).getTime() - toUtc(a).getTime()) / 86_400_000);
}
