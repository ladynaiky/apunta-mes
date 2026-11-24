/**
 * Fechas en catalán como en el diseño. Trabaja con texto AAAA-MM-DD (sin
 * zona horaria), igual que la API. La semana empieza en dilluns.
 */
const MONTHS = ['gener', 'febrer', 'març', 'abril', 'maig', 'juny', 'juliol', 'agost', 'setembre', 'octubre', 'novembre', 'desembre'];
const WEEKDAYS = ['dilluns', 'dimarts', 'dimecres', 'dijous', 'divendres', 'dissabte', 'diumenge'];
const WEEKDAYS_SHORT = ['Dl', 'Dt', 'Dc', 'Dj', 'Dv', 'Ds', 'Dg'];

const parts = (date: string) => date.split('-').map(Number) as [number, number, number];
const toUtc = (date: string) => new Date(`${date}T00:00:00Z`);
const fromUtc = (d: Date) => d.toISOString().slice(0, 10);
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** 0 = dilluns … 6 = diumenge */
export function weekdayIndex(date: string): number {
  return (toUtc(date).getUTCDay() + 6) % 7;
}

export function addDays(date: string, days: number): string {
  const d = toUtc(date);
  d.setUTCDate(d.getUTCDate() + days);
  return fromUtc(d);
}

export function weekDays(date: string): string[] {
  const monday = addDays(date, -weekdayIndex(date));
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
}

/** «de novembre», «d’octubre», «d’abril», «d’agost». */
export function ofMonth(monthIndex: number): string {
  const m = MONTHS[monthIndex];
  return /^[aeiouàèéíòóú]/.test(m) ? `d’${m}` : `de ${m}`;
}

/** «4 de novembre» */
export function dayMonth(date: string): string {
  const [, m, d] = parts(date);
  return `${d} ${ofMonth(m - 1)}`;
}

/** «Dimecres 4 de novembre» */
export function longDate(date: string): string {
  return `${capitalize(WEEKDAYS[weekdayIndex(date)])} ${dayMonth(date)}`;
}

/** «Novembre 2026» */
export function monthTitle(month: string): string {
  const [y, m] = month.split('-').map(Number);
  return `${capitalize(MONTHS[m - 1])} ${y}`;
}

/** «Setmana del 2 al 8 de novembre» · «Setmana del 30 de novembre al 6 de desembre» */
export function weekTitle(date: string): string {
  const days = weekDays(date);
  const [, m1, d1] = parts(days[0]);
  const [, m2, d2] = parts(days[6]);
  return m1 === m2
    ? `Setmana del ${d1} al ${d2} ${ofMonth(m2 - 1)}`
    : `Setmana del ${dayMonth(days[0])} al ${dayMonth(days[6])}`;
}

/** «dv. 6» */
export function shortDay(date: string): string {
  return `${WEEKDAYS_SHORT[weekdayIndex(date)].toLowerCase()}. ${parts(date)[2]}`;
}

export function weekdayShort(date: string): string {
  return WEEKDAYS_SHORT[weekdayIndex(date)];
}

export const WEEKDAY_HEADERS = WEEKDAYS_SHORT;

/** Texto de apoyo de una fila: «Per a avui», «Per al 12 de novembre», «Per a l’1 d’octubre». */
export function dueLabel(date: string, today: string): string {
  if (date === today) return 'Per a avui';
  const day = parts(date)[2];
  const article = day === 1 || day === 11 ? 'a l’' : 'al ';
  return `Per ${article}${dayMonth(date)}`;
}

/** Saludo según la hora real (como en el diseño). */
export function greeting(hour: number): string {
  if (hour >= 6 && hour < 12) return 'Bon dia!';
  if (hour >= 12 && hour < 21) return 'Bona tarda!';
  return 'Bona nit!';
}

const MONTHS_SHORT = ['gen.', 'febr.', 'març', 'abr.', 'maig', 'juny', 'jul.', 'ag.', 'set.', 'oct.', 'nov.', 'des.'];

/** «Dc. 4 de nov.» · «Dj. 1 d’oct.» (camps de data i date picker). */
export function shortDate(date: string): string {
  const [, m, d] = parts(date);
  const month = MONTHS_SHORT[m - 1];
  const of = /^[aeiou]/.test(month) ? `d’${month}` : `de ${month}`;
  return `${WEEKDAYS_SHORT[weekdayIndex(date)]}. ${d} ${of}`;
}
