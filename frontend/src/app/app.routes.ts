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

      // Fases 6B, 6C y 7 (provisionales)
      soon('calendar/month', 'Calendari setmanal/mensual'),
      soon('calendar/day/:date', 'Tasques del dia'),
      soon('exams', 'Exàmens'),
      soon('trips', 'Excursions'),
      soon('tasks/today', 'Tasca d’avui/setmanal'),
      soon('tasks/list', 'Llistat de tasques'),
      soon('tasks/history', 'Historial de tasques'),
      soon('tasks/checklist', 'Checklist'),
      soon('tasks/mark-done', 'Marcar tasca feta'),
      soon('search', 'Buscar/Filtrar'),
      soon('share', 'Compartir'),
      soon('share/tasks', 'Compartir tasques'),
    ],
  },

  { path: '**', redirectTo: 'tabs/home' },
];
