import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { NotificationService } from 'src/app/shared';

@Injectable({
    providedIn: 'root'
})
export class HttpErrorInterceptor implements HttpInterceptor {
    constructor(
        private notificationService: NotificationService,
        private router: Router
    ) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError(error => {
                let errorStatus = this.getErrorStatusCode(error);
                let errorMessage = this.getErrorMessage(error);
                let showError = true;

                switch (errorStatus) {
                    case 0:
                        showError = false;
                        this.router.navigate(['/home']);
                        this.notificationService.showServerNotResponding();
                        break;
                    case 401:
                    case 403:
                        this.router.navigate(['/unauthorized']);
                        break;
                    case 404:
                        errorMessage = 'El registro no existe o fue eliminado';
                        break;
                    default:
                        break;
                }
                
                if (showError) {
                    console.error(errorMessage, error);
                    this.notificationService.showDanger(errorMessage);                    
                }

                return throwError(() => errorMessage);
            }),
            // Gestionar Multistatus (207): mostrar warning y ajustar el body 
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse && event.status === 207) {
                    this.notificationService.showWarning(this.getErrorMessage(event.body));
                    return event.clone({ body: event.body.value });
                }
                return event;
              }
            ),
        );
    }

    private getErrorMessage(error: any): string {
        let result = error?.error?.message;
        let resultAlt = error.error;

        if (resultAlt instanceof Blob) {
            result = 'Ocurrió un error al procesar la solicitud';
        }

        return result ?? resultAlt ?? 'Ocurrió un error al procesar la solicitud';
    }

    private getErrorStatusCode(error: any): number {
        return error?.status;
    }
}
