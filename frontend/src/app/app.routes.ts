import { Routes } from '@angular/router';

export const routes: Routes = [
  // Mientras no existen las pantallas (fase 4), la app abre la página de componentes.
  { path: '', pathMatch: 'full', redirectTo: 'dev/components' },
  {
    path: 'dev/components',
    loadComponent: () =>
      import('./features/dev/components-page').then((m) => m.ComponentsPage),
  },
  { path: '**', redirectTo: '' },
];
