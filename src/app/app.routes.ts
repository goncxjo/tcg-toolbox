import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { OldHomeComponent } from './components/home_old/home_old.component';

export const routes: Routes = [
    {
      path: 'home',
      data: {
        title: 'Inicio',
      },
      component: HomeComponent,
    },
    {
      path: 'old',
      data: {
        title: 'Inicio',
      },
      component: OldHomeComponent,
    },
    {
      path: 'posts', 
      loadChildren: () => import('./pages/posts/posts.routes').then((m) => m.POSTS_ROUTES),
    },
    {
      path: '**',
      redirectTo: 'home',
      pathMatch: 'full'
    },
];
  
