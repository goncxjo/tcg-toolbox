import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '../services';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
    const notificationService = inject(NotificationService);
    const router = inject(Router);

    return next(req).pipe(
        catchError(error => {
            let errorStatus = getErrorStatusCode(error);
            let errorMessage = getErrorMessage(error);
            let showError = true;

            switch (errorStatus) {
                case 0:
                    showError = false;
                    router.navigate(['/']);
                    notificationService.showWarning(errorMessage);
                    break;
                case 401:
                case 403:
                    router.navigate(['/unauthorized']);
                    break;
                case 404:
                    errorMessage = 'El registro no existe o fue eliminado';
                    router.navigate(['/']);
                    break;
                default:
                    errorMessage = 'Ocurrió un error al conectarse con el servidor. Aún puede continuar utilizando el buscador';
                    break;
            }

            if (showError) {
                notificationService.showDanger(errorMessage);
            }

            return throwError(() => errorMessage);
        }),
    )
};

function getErrorMessage(error: any): string {
    let result = error?.error?.errorMessage;
    let resultAlt = error?.error;

    if (resultAlt instanceof Blob) {
        result = 'Ocurrió un error al procesar la solicitud';
    }

    return result ?? resultAlt ?? 'Ocurrió un error al procesar la solicitud';
}

function getErrorStatusCode(error: any): number {
    return error?.error?.statusCode;
}
