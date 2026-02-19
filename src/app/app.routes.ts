import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'pagina-inicial',
  },
  {
    path: 'pagina-inicial',
    loadComponent: () =>
      import('./features/pagina-inicial/pagina-inicial.component').then(
        (c) => c.PaginaInicialComponent,
      ),
  },
];
