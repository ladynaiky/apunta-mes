import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/auth/auth.guards';

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

  // App (con sesión). En la fase 5, /tabs tendrá sus 4 pestañas.
  {
    path: 'tabs/home',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/home/home-placeholder-page').then((m) => m.HomePlaceholderPage),
  },

  // Desarrollo
  {
    path: 'dev/components',
    loadComponent: () => import('./features/dev/components-page').then((m) => m.ComponentsPage),
  },

  { path: '**', redirectTo: 'tabs/home' },
];
