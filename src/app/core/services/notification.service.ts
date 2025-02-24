import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    constructor(
        private toastr: ToastrService
    ) { }

    showInfo(message: string, title: string = '') {
        this.toastr.info(message, title);
    }

    showSuccess(message: string, title: string = '') {
        this.toastr.success(message, title);
    }

    showWarning(message: string, title: string = '') {
        this.toastr.warning(message, title);
    }

    showDanger(message: string, title: string = '') {
        this.toastr.error(message, title);
    }

    showNotAuthorized() {
        if (!this.toastr.currentlyActive) {
            this.toastr.info('Acceso no autorizado');
        }
    }

    showServerNotResponding() {
        if (!this.toastr.currentlyActive) {
            this.toastr.error('Ha ocurrido un error al intentar comunicarse con el servidor. Consulte con su administrador', 'Error de servidor');
        }
    }
}
