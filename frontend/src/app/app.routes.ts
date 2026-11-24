import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/auth/auth.guards';

/** Pantalla provisional (fases 6 y 7) con su título del diseño. */
const soon = (path: string, title: string) => ({
  path,
  canActivate: [authGuard],
  data: { title },
  loadComponent: () =>
    import('./features/coming-soon/coming-soon-page').then((m) => m.ComingSoonPage),
});

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'tabs/home' },

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

  // Pestañas (nivel 1)
  {
    path: 'tabs',
    canActivate: [authGuard],
    loadComponent: () => import('./features/tabs/tabs-shell').then((m) => m.TabsShell),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'home' },
      { path: 'home', loadComponent: () => import('./features/home/home-page').then((m) => m.HomePage) },
      {
        path: 'calendar',
        loadComponent: () => import('./features/calendar/calendar-page').then((m) => m.CalendarPage),
      },
      {
        path: 'tasks',
        data: { title: 'Tasques' },
        loadComponent: () => import('./features/home/home-placeholder-page').then((m) => m.HomePlaceholderPage),
      },
      {
        path: 'ai',
        data: { title: 'IA' },
        loadComponent: () => import('./features/home/home-placeholder-page').then((m) => m.HomePlaceholderPage),
      },
    ],
  },
  {
    path: 'me',
    canActivate: [authGuard],
    data: { title: 'El meu espai' },
    loadComponent: () => import('./features/home/home-placeholder-page').then((m) => m.HomePlaceholderPage),
  },

  // Fases 6 y 7 (provisionales)
  soon('calendar/month', 'Calendari setmanal/mensual'),
  soon('calendar/day/:date', 'Tasques del dia'),
  soon('exams', 'Exàmens'),
  soon('trips', 'Excursions'),
  soon('tasks/today', 'Tasca d’avui/setmanal'),
  soon('tasks/list', 'Llistat de tasques'),
  soon('tasks/history', 'Historial de tasques'),
  soon('tasks/checklist', 'Checklist'),
  soon('tasks/mark-done', 'Marcar tasca feta'),
  soon('new/task', 'Apuntar nova tasca'),
  soon('new/exam', 'Apuntar examen'),
  soon('new/trip', 'Apuntar excursió'),
  soon('new/birthday', 'Apuntar aniversari'),
  soon('subjects/new', 'Crear nova assignatura'),
  soon('search', 'Buscar/Filtrar'),
  soon('share', 'Compartir'),
  soon('share/tasks', 'Compartir tasques'),

  // Desarrollo
  {
    path: 'dev/components',
    loadComponent: () => import('./features/dev/components-page').then((m) => m.ComponentsPage),
  },

  { path: '**', redirectTo: 'tabs/home' },
];
