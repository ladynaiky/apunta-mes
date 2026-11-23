/**
 * Datos de demo (noviembre de 2026, «hoy» = dimecres 4).
 * Aprobados en la fase 2 (apartado C). Coinciden con la alta fidelidad:
 * días 4, 6, 13, 17 y 20; examen de Mates el 13 (decisión 2.1.4 de CLAUDE.md).
 */
type SubjectName =
  | 'Castellà'
  | 'Català'
  | 'Anglès'
  | 'Socials'
  | 'Plàstica'
  | 'Música'
  | 'Mates';

const REMINDER = { daysBefore: 1, time: '08:00' };

export const DEMO_USER = { name: 'Demo', role: 'student' as const };

export interface DemoEntry {
  type: 'task' | 'exam' | 'trip' | 'birthday';
  date: string;
  title?: string;
  subject?: SubjectName;
  [key: string]: unknown;
}

/** Pendientes. */
export const DEMO_ENTRIES: DemoEntry[] = [
  {
    type: 'task',
    date: '2026-11-04',
    subject: 'Mates',
    title: 'Exercicis, pàg. 12',
    page: '12',
    shared: true,
    reminder: REMINDER,
  },
  {
    type: 'task',
    date: '2026-11-04',
    subject: 'Català',
    title: 'Llegir el capítol 3',
    shared: true,
    reminder: REMINDER,
  },
  {
    type: 'task',
    date: '2026-11-04',
    subject: 'Música',
    title: 'Practicar la cançó',
    shared: true,
    reminder: REMINDER,
  },
  {
    type: 'task',
    date: '2026-11-05',
    subject: 'Socials',
    title: 'Fer el resum',
  },
  {
    type: 'task',
    date: '2026-11-05',
    subject: 'Plàstica',
    title: 'Acabar el dibuix',
  },
  {
    type: 'task',
    date: '2026-11-06',
    subject: 'Anglès',
    title: 'Preparar la redacció',
    priority: 'high',
    reminder: REMINDER,
  },
  {
    type: 'task',
    date: '2026-11-12',
    subject: 'Mates',
    title: 'Repassar el tema 2',
  },
  {
    type: 'exam',
    date: '2026-11-13',
    subject: 'Mates',
    title: 'Examen de Mates',
    topic: 'Fraccions i decimals',
    examType: 'written',
    toStudy:
      'Tema 3: fraccions equivalents, sumes i restes de fraccions, nombres decimals.',
    reminder: REMINDER,
  },
  {
    type: 'exam',
    date: '2026-11-17',
    subject: 'Català',
    title: 'Examen de Català',
    topic: 'Ortografia i verbs',
    examType: 'written',
    reminder: REMINDER,
  },
  {
    type: 'trip',
    date: '2026-11-20',
    subject: 'Socials',
    title: 'Excursió de Socials',
    place: 'Museu d’Història de Catalunya',
    departureTime: '09:00',
    returnTime: '17:00',
    whatToBring: [
      { name: 'Autorització signada', done: false },
      { name: 'Dinar i aigua', done: false },
      { name: 'Gorra i crema solar', done: false },
      { name: 'Roba i calçat còmodes', done: false },
    ],
    reminder: REMINDER,
  },
  {
    type: 'birthday',
    date: '2026-11-24',
    title: 'l’Anna',
    personName: 'l’Anna',
    age: 12,
    relation: 'class',
    giftIdeas: 'Un llibre de dibuix',
    reminder: REMINDER,
  },
];

/** Historial: tareas hechas (las 14 de la alta fidelidad). */
export const DEMO_HISTORY: {
  date: string;
  subject: SubjectName;
  title: string;
}[] = [
  { date: '2026-11-02', subject: 'Mates', title: 'Exercicis, pàg. 10' },
  { date: '2026-11-03', subject: 'Català', title: 'Llegir el capítol 2' },
  { date: '2026-11-03', subject: 'Anglès', title: 'Aprendre el vocabulari' },
  { date: '2026-10-28', subject: 'Socials', title: 'Resum del tema 2' },
  { date: '2026-10-21', subject: 'Mates', title: 'Problemes de fraccions' },
  { date: '2026-10-15', subject: 'Anglès', title: 'Preparar la redacció' },
  { date: '2026-10-09', subject: 'Plàstica', title: 'Acabar el dibuix' },
  { date: '2026-09-30', subject: 'Castellà', title: 'Lectura del capítol 1' },
  { date: '2026-09-24', subject: 'Música', title: 'Practicar la flauta' },
  { date: '2026-09-16', subject: 'Mates', title: 'Exercicis, pàg. 4' },
  { date: '2026-06-12', subject: 'Català', title: 'Examen de gramàtica' },
  { date: '2026-06-09', subject: 'Socials', title: 'Repassar el tema 6' },
  { date: '2025-12-18', subject: 'Mates', title: 'Exercicis, pàg. 52' },
  { date: '2025-12-11', subject: 'Plàstica', title: 'Acabar la làmina' },
];

export const DEMO_CONTACTS = [
  { name: 'Jordi (pare)', emailOrPhone: 'jordi@exemple.cat', role: 'parent' },
  { name: 'Núria (mare)', emailOrPhone: 'nuria@exemple.cat', role: 'parent' },
  { name: 'Marta', emailOrPhone: 'marta@exemple.cat', role: 'student' },
  {
    name: 'Sr. Martí (tutor)',
    emailOrPhone: 'marti@escola.cat',
    role: 'teacher',
  },
  {
    name: 'Sra. Vidal (Anglès)',
    emailOrPhone: 'vidal@escola.cat',
    role: 'teacher',
  },
] as const;

/** «Última sincronització: avui, 8:15» (8:15 en Madrid = 7:15 UTC en noviembre). */
export const DEMO_LAST_SYNC = new Date('2026-11-04T07:15:00Z');
