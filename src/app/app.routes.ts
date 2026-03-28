import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login').then((m) => m.LoginComponent),
  },
];
