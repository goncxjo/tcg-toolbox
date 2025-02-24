import { Routes } from '@angular/router';
import { PostsListComponent } from './posts-list/posts-list.component';
import { PostsEditComponent } from './posts-edit/posts-edit.component';
import { getByIdResolver }  from './get-by-id.resolver';
import { createResolver } from './create.resolver';

export const POSTS_ROUTES: Routes = [
    {
      path: '',
      data: {
        title: 'Publicaciones',
      },
      component: PostsListComponent,
    },
    {
      path: 'create',
      data: {
        title: 'Crear',
        editMode: true,
      },
      resolve: {
        entity: createResolver
      },
      component: PostsEditComponent,
    },
    {
      path: ':id',
      data: {
        title: 'Ver',
        readonly: true,
      },
      resolve: {
        entity: getByIdResolver
      },
      component: PostsEditComponent,
    },
    {
      path: ':id/edit',
      data: {
        title: 'Editar',
        editMode: true,
      },
      resolve: {
        entity: getByIdResolver
      },
      component: PostsEditComponent,
    },
];
