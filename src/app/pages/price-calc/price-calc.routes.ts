import { Routes } from '@angular/router';
import { createResolver } from './card-lists/create.resolver';
import { CardListsEditComponent } from './card-lists/card-lists-edit/card-lists-edit.component';

export const PRICE_CALCULATOR_ROUTES: Routes = [
  {
    path: '',
    data: {
      title: 'Crear',
      breadcrumb: 'Crear'
    },
    resolve: {
      entity: createResolver
    },
    component: CardListsEditComponent,
  },
  {
    path: 'card-lists',
    data: {
      breadcrumb: 'Lista de cartas'
    },
    loadChildren: () => import('./card-lists/card-lists.routes').then((m) => m.CARD_LISTS_ROUTES),
  },
];
