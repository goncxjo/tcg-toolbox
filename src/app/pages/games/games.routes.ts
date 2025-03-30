import { Routes } from '@angular/router';
import { GamesComponent } from './games.component';
import { isGameValidGuard } from './is-game-valid.guard';

export const GAMES_ROUTES: Routes = [
    {
      path: '',
      data: {
        title: 'Expansiones',
      },
      component: GamesComponent,
    },
    {
      path: ':game',
      data: {
        title: 'Expansiones',
      },
      canActivate: [isGameValidGuard],
      component: GamesComponent,

    }
];
