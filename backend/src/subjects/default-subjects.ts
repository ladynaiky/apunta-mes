/**
 * Las 8 asignaturas que se crean al registrarse (7 + «Excursions», 25/11/2026), con sus colores de alta
 * fidelidad. colorToken es el nombre del token del Design System.
 */
export const SUBJECT_COLORS = {
  taronja: '#CC5500',
  groc: '#B08800',
  lila: '#9A6ADE',
  verd: '#2E8540',
  turquesa: '#00879A',
  rosa: '#D02670',
  blau: '#1F4FB8',
  /** Marró: «Excursions» (5.4:1 sobre el crema). */
  marro: '#8B5E34',
} as const;

export type SubjectColorToken = keyof typeof SUBJECT_COLORS;
export const SUBJECT_COLOR_TOKENS = Object.keys(
  SUBJECT_COLORS,
) as SubjectColorToken[];

export const DEFAULT_SUBJECTS: {
  name: string;
  colorToken: SubjectColorToken;
}[] = [
  { name: 'Castellà', colorToken: 'taronja' },
  { name: 'Català', colorToken: 'groc' },
  { name: 'Anglès', colorToken: 'lila' },
  { name: 'Socials', colorToken: 'verd' },
  { name: 'Plàstica', colorToken: 'turquesa' },
  { name: 'Música', colorToken: 'rosa' },
  { name: 'Mates', colorToken: 'blau' },
  { name: 'Excursions', colorToken: 'marro' },
];

/** Asignatura de las excursiones: se les pone siempre al apuntarlas (y se crea si no existe). */
export const TRIP_SUBJECT = {
  name: 'Excursions',
  colorToken: 'marro',
} as const;
