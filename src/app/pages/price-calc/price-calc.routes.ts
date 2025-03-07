import { Routes } from '@angular/router';

export const PRICE_CALCULATOR_ROUTES: Routes = [
  {
    path: 'card-lists', 
    loadChildren: () => import('./card-lists/card-lists.routes').then((m) => m.CARD_LISTS_ROUTES),
  },
  {
    path: '',
    redirectTo: 'card-lists',
    pathMatch: 'full'
  }
];
