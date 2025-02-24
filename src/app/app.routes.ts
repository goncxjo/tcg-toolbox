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
      path: 'card-lists', 
      loadChildren: () => import('./pages/card-lists/card-lists.routes').then((m) => m.CARD_LISTS_ROUTES),
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
  
