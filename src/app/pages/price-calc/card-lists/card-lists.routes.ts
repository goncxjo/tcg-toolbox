import { Routes } from '@angular/router';
import { CardListsListComponent } from './card-lists-list/card-lists-list.component';
import { CardListsEditComponent } from './card-lists-edit/card-lists-edit.component';
import { getByIdResolver }  from './get-by-id.resolver';
import { createResolver } from './create.resolver';
import { AuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { isOwnerGuard } from './is-owner.guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/price-calc','card-lists','new']);

export const CARD_LISTS_ROUTES: Routes = [
  {
    path: '',
    component: CardListsListComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Listas',
      authGuardPipe: redirectUnauthorizedToLogin,
    },
  },
  {
    path: 'new',
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
    path: ':id',
    resolve: {
      entity: getByIdResolver
    },
    component: CardListsEditComponent,
    data: {
      title: 'Ver',
      breadcrumb: 'Ver',
      readonly: true,
    },
  },
  {
    path: ':id/edit',
    resolve: {
      entity: getByIdResolver
    },
    component: CardListsEditComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Editar',
      breadcrumb: 'Editar',
      authGuardPipe: redirectUnauthorizedToLogin,
      editMode: true,
    },
  },
];
