import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
    {
      path: 'home',
      data: {
        title: 'Inicio',
      },
      component: HomeComponent,
    },
    {
      path: 'price-calculator', 
      loadChildren: () => import('./pages/price-calculator/price-calculator.routes').then((m) => m.PRICE_CALCULATOR_ROUTES),
    },
    // {
    //   path: 'games', 
    //   loadChildren: () => import('./pages/games/games.routes').then((m) => m.GAMES_ROUTES),
    // },
    {
      path: '',
      redirectTo: 'home',
      pathMatch: 'full'
    },
    {
      path: '**',
      component: NotFoundComponent,
      pathMatch: 'full'
    },
];
  
