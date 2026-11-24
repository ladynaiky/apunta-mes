import type { SubjectColorToken } from '../../shared/utils/task-title';

export type EntryType = 'task' | 'exam' | 'trip' | 'birthday';

export interface Subject {
  id: string;
  name: string;
  colorToken: SubjectColorToken;
  colorHex: string;
}

export interface Reminder {
  daysBefore: number;
  time: string;
}

export interface CheckItem {
  name: string;
  done: boolean;
}

/** Lo que se apunta (respuesta de /entries). */
export interface Entry {
  id: string;
  type: EntryType;
  title: string;
  /** AAAA-MM-DD */
  date: string;
  notes: string;
  reminder: Reminder | null;
  priority: 'high' | null;
  shared: boolean;
  subject: Subject | null;
  done: boolean;
  doneAt: string | null;
  page: string;
  activity: string;
  topic: string;
  examType: 'written' | 'oral' | 'project' | null;
  toStudy: string;
  place: string;
  departureTime: string;
  returnTime: string;
  whatToBring: CheckItem[];
  personName: string;
  age: number | null;
  relation: 'family' | 'class' | 'friend' | null;
  giftIdeas: string;
  createdAt: string;
}

/** Datos para crear o editar (subject como id). */
export type EntryInput = Partial<Omit<Entry, 'id' | 'subject' | 'createdAt' | 'doneAt'>> & {
  subject?: string | null;
};

export interface CalendarDot {
  type: EntryType;
  subjectName: string | null;
  colorToken: SubjectColorToken | null;
  colorHex: string | null;
}

export interface CalendarDay {
  date: string;
  count: number;
  dots: CalendarDot[];
}

export interface ReminderEntry extends Entry {
  daysLeft: number;
}

export interface AppConfig {
  today: string;
  timeZone: string;
  demoMode: boolean;
}

export type { ContactRole } from '../../shared/utils/roles';
import type { ContactRole } from '../../shared/utils/roles';

export interface Contact {
  id: string;
  name: string;
  emailOrPhone: string;
  role: ContactRole;
}

export type GroupBy = 'subjects' | 'priority' | 'date';
export type MarkWith = 'colors' | 'tags';
export type TagKey = 'todo' | 'done' | 'highPriority' | 'lowPriority';

export interface Preferences {
  groupBy: GroupBy;
  markWith: MarkWith;
  visibleTags: TagKey[];
}

export interface AiMessage {
  from: 'user' | 'assistant';
  text: string;
  suggestion: boolean;
}
