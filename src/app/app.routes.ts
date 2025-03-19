import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { inject } from '@angular/core';
import { ToolService } from './core';

function resetTool() {
  inject(ToolService).clean()
  return true;
}

export const routes: Routes = [
    {
      path: 'home',
      data: {
        title: 'Inicio',
        breadcrumb: { skip: true }
      },
      component: HomeComponent,
      canActivate: [() => resetTool()]
    },
    {
      path: 'price-calc',
      data: {
        breadcrumb: 'Price Calculator'
      },
      loadChildren: () => import('./pages/price-calc/price-calc.routes').then((m) => m.PRICE_CALCULATOR_ROUTES),
      canActivateChild: [() => {
        inject(ToolService).set('price-calc')
        return true;
      }]
    },
    // {
    //   path: 'games',
    //   loadChildren: () => import('./pages/games/games.routes').then((m) => m.GAMES_ROUTES),
    // },
    {
      path: '',
      data: {
        breadcrumb: { skip: true }
      },
      redirectTo: 'home',
      pathMatch: 'full',
    },
    {
      path: '**',
      data: {
        breadcrumb: { skip: true }
      },
      component: NotFoundComponent,
      pathMatch: 'full',
      canActivate: [() => resetTool()]

    },
];

