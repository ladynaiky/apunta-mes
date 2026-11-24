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
