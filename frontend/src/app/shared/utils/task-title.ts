import type { Entry } from '../../core/data/models';
import { ca } from '../../i18n/ca';

/** «Mates» + «Exercicis, pàg. 12» → «Mates: exercicis, pàg. 12» (formato del diseño). */
export function taskLabel(subjectName: string | null | undefined, title: string, lowercase = true): string {
  if (!subjectName) return title;
  const rest = lowercase ? title.charAt(0).toLocaleLowerCase('ca') + title.slice(1) : title;
  return `${subjectName}: ${rest}`;
}

export type SubjectColorToken =
  | 'taronja'
  | 'groc'
  | 'lila'
  | 'verd'
  | 'turquesa'
  | 'rosa'
  | 'blau';

/** Título de la fila: los aniversarios dicen «Aniversari de l’Anna». */
export function rowTitle(e: Entry): string {
  return e.type === 'birthday' ? ca.task.birthday(e.personName || e.title) : e.title;
}

/** Texto de apoyo de un aniversario («Fa 12 anys») o null. */
export function birthdaySupport(e: Entry): string | null {
  return e.type === 'birthday' && e.age !== null ? ca.task.birthdayAge(e.age) : null;
}
