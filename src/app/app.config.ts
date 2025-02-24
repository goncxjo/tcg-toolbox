import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { httpErrorInterceptor, httpLoaderInterceptor } from './core/interceptors';
import { initializeApplicationConfig } from './core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([httpErrorInterceptor, httpLoaderInterceptor])),
    provideToastr(),
    initializeApplicationConfig()
  ]
};
