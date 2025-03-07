import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { UserService } from "../../../core";
import { ToastrService } from "ngx-toastr";

export const isOwnerGuard: CanActivateFn =  (route, state) => {
    const userId = inject(UserService).getUserId();
    setTimeout(() => {
      if (route.data['editMode'] && userId !== route.data['entity']?.user) {
        inject(ToastrService).info('No puede editar listas de otros usuarios')
        inject(Router).navigate(['/home']);
      }
    }, 500);
    return true;
};
