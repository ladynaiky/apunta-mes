import { ca } from '../../i18n/ca';

/** Roles que se pueden elegir (iteración 1: masculino y femenino). */
export const PERSON_ROLES = ['student', 'student_f', 'father', 'mother', 'tutor_m', 'tutor_f', 'teacher_m', 'teacher_f'] as const;
/** `parent` y `teacher` son los roles de antes: solo se leen (datos guardados). */
export type PersonRole = (typeof PERSON_ROLES)[number] | 'parent' | 'teacher';
export type ContactRole = PersonRole | 'other';

/** Grupos de Compartir: alumnes, família, professors y altres. */
export type RoleGroup = 'student' | 'family' | 'teacher' | 'other';

export function roleGroup(role: ContactRole): RoleGroup {
  if (role === 'student' || role === 'student_f') return 'student';
  if (role === 'teacher' || role === 'teacher_m' || role === 'teacher_f') return 'teacher';
  if (role === 'other') return 'other';
  return 'family';
}

export function roleLabel(role: ContactRole): string {
  return ca.roles[role] ?? role;
}

export function roleOptions(withOther = false): { value: ContactRole; label: string }[] {
  const list: ContactRole[] = withOther ? [...PERSON_ROLES, 'other'] : [...PERSON_ROLES];
  return list.map((r) => ({ value: r, label: roleLabel(r) }));
}
