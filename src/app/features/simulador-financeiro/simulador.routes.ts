import { Routes } from '@angular/router';

export const SIMULADOR_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./simulador.component').then(m => m.SimuladorComponent),
  }
];