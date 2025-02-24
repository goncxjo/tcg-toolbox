import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ComoFuncionaComponent } from './como-funciona/como-funciona.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Inicio',
    },
    component: HomeComponent,
  },
  {
    path: 'como-funciona',
    data: {
      title: 'Cómo funciona',
    },
    component: ComoFuncionaComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
