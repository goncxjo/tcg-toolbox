import { HttpRequest, HttpInterceptorFn, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoaderService } from '../services';

export const httpLoaderInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const loaderService = inject(LoaderService);

  loaderService.show();
  if (req.url.includes('bluelytics')) {
    loaderService.hide();
  }
  return next(req).pipe(
    finalize(() => {
        loaderService.hide();
    }));
};
