/**
 * Las 7 asignaturas que se crean al registrarse, con sus colores de alta
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
];
