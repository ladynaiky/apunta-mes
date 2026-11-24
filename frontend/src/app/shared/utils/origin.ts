/**
 * Pantallas de origen (`?from=`): a dónde vuelve «Enrere» / «No» y qué
 * pestaña se marca en la barra de navegación.
 */
const ORIGINS: Record<string, string> = {
  home: '/tabs/home',
  calendar: '/tabs/calendar',
  tasks: '/tabs/tasks',
  ai: '/tabs/ai',
  me: '/tabs/me',
  exams: '/exams',
  trips: '/trips',
};

export function originUrl(from: string | null | undefined): string {
  return ORIGINS[from ?? ''] ?? '/tabs/home';
}

/** Pestaña de la barra que corresponde a un origen (o null). */
export function originTab(from: string | null | undefined): 'home' | 'calendar' | 'tasks' | 'ai' | null {
  if (from === 'home' || from === 'calendar' || from === 'tasks' || from === 'ai') return from;
  if (from === 'exams' || from === 'trips') return 'calendar';
  return null;
}
