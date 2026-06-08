import { Routes } from '@angular/router';
import { SIMULADOR_ROUTES } from './features/simulador-financeiro/simulador.routes';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./portfolio.component').then(m => m.PortfolioComponent)
  },
  {
    path: 'simulador',
    children: SIMULADOR_ROUTES
  },





  // Essa sempre deve ser a ÚLTIMA ROTA da lista
  {
    path: '**',
    redirectTo: ''
  }
];