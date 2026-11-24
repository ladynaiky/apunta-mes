import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/auth/auth.guards';

/** Pantalla provisional (fases 6 y 7) con su título del diseño. */
const soon = (path: string, title: string) => ({
  path,
  data: { title },
  loadComponent: () =>
    import('./features/coming-soon/coming-soon-page').then((m) => m.ComingSoonPage),
});

export const routes: Routes = [
  // Acceso (sin sesión)
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login/login-page').then((m) => m.LoginPage),
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/register/register-page').then((m) => m.RegisterPage),
  },
  {
    path: 'register/done',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/auth/account-created/account-created-page').then((m) => m.AccountCreatedPage),
  },

  // Desarrollo
  {
    path: 'dev/components',
    loadComponent: () => import('./features/dev/components-page').then((m) => m.ComponentsPage),
  },

  // App con sesión: todas las pantallas dentro del marco con la barra de navegación.
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./features/tabs/tabs-shell').then((m) => m.TabsShell),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'tabs/home' },

      // Nivel 1 (pestañas)
      { path: 'tabs/home', loadComponent: () => import('./features/home/home-page').then((m) => m.HomePage) },
      {
        path: 'tabs/calendar',
        loadComponent: () => import('./features/calendar/calendar-page').then((m) => m.CalendarPage),
      },
      { path: 'tabs/tasks', loadComponent: () => import('./features/tasks/tasks-page').then((m) => m.TasksPage) },
      { path: 'tabs/ai', loadComponent: () => import('./features/ai/ai-page').then((m) => m.AiPage) },
      { path: 'tabs/me', loadComponent: () => import('./features/me/me-page').then((m) => m.MePage) },

      // 6A · Apuntar
      {
        path: 'new/:type',
        loadComponent: () => import('./features/new-entry/new-entry-page').then((m) => m.NewEntryPage),
      },
      {
        path: 'new/:type/done/:id',
        loadComponent: () => import('./features/new-entry/created-page').then((m) => m.CreatedPage),
      },
      {
        path: 'subjects/new',
        loadComponent: () => import('./features/new-subject/new-subject-page').then((m) => m.NewSubjectPage),
      },

      // Nivel 3 de El meu espai: abren su pestaña (decisión de la fase 6).
      { path: 'me/reminders', redirectTo: '/tabs/me?tab=reminders' },
      { path: 'me/customize', redirectTo: '/tabs/me?tab=customize' },
      { path: 'me/sync', redirectTo: '/tabs/me?tab=contacts' },

      // Fase 7 (provisionales)
      // 6B · Calendario y listas
      {
        path: 'calendar/month',
        loadComponent: () =>
          import('./features/calendar-month/calendar-month-page').then((m) => m.CalendarMonthPage),
      },
      { path: 'calendar/day/:date', loadComponent: () => import('./features/day/day-page').then((m) => m.DayPage) },
      {
        path: 'exams',
        data: { type: 'exam' },
        loadComponent: () => import('./features/entry-list/entry-list-page').then((m) => m.EntryListPage),
      },
      {
        path: 'trips',
        data: { type: 'trip' },
        loadComponent: () => import('./features/entry-list/entry-list-page').then((m) => m.EntryListPage),
      },

      // 6C · Vistas de tareas
      {
        path: 'tasks/today',
        loadComponent: () => import('./features/task-views/today-week-page').then((m) => m.TodayWeekPage),
      },
      {
        path: 'tasks/list',
        loadComponent: () => import('./features/task-views/task-list-page').then((m) => m.TaskListPage),
      },
      {
        path: 'tasks/history',
        loadComponent: () => import('./features/task-views/history-page').then((m) => m.HistoryPage),
      },
      {
        path: 'tasks/checklist',
        loadComponent: () => import('./features/task-views/checklist-page').then((m) => m.ChecklistPage),
      },
      {
        path: 'tasks/mark-done',
        loadComponent: () => import('./features/task-views/mark-done-page').then((m) => m.MarkDonePage),
      },

      // 7A · Buscar/Filtrar
      { path: 'search', loadComponent: () => import('./features/search/search-page').then((m) => m.SearchPage) },
      {
        path: 'search/results',
        loadComponent: () => import('./features/search/search-results-page').then((m) => m.SearchResultsPage),
      },
      soon('share', 'Compartir'),
      soon('share/tasks', 'Compartir tasques'),
    ],
  },

  { path: '**', redirectTo: 'tabs/home' },
];
