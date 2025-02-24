import { HttpRequest, HttpInterceptorFn, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoaderService } from '../services';

export const httpLoaderInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const loaderService = inject(LoaderService);

  if (req.url.includes('bluelytics')) {
    loaderService.setHttpProgressStatus(false);
  }
  else if (req.url.includes('pricepoints')) {
    loaderService.setHttpProgressStatus(true);
  }
  else if (loaderService.count === 0) {
    loaderService.setHttpProgressStatus(true);
  }
  loaderService.count++;
  return next(req).pipe(
    finalize(() => {
      loaderService.count--;
      if (loaderService.count === 0) {
        loaderService.setHttpProgressStatus(false);
      }
    }));
};
