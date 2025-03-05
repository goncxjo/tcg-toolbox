import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { UserService } from "../../core";
import { ToastrService } from "ngx-toastr";

export const isOwnerGuard: CanActivateFn =  (route, state) => {
    if (route.data['editMode'] && inject(UserService).getUserId() !== route.data['entity']?.user) {
      inject(ToastrService).info('No puede editar listas de otros usuarios')
        inject(Router).navigate(['/home']);
    }
    return true;
};
