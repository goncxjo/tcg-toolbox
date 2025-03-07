import { inject } from "@angular/core";
import { ResolveFn, Router } from "@angular/router";
import { CardListService } from "../../../backend";
import { tap } from "rxjs";
import { LoaderService } from "../../../core";
import { ToastrService } from "ngx-toastr";

export const getByIdResolver: ResolveFn<Object> = (route, state) => {
    const loaderService = inject(LoaderService);
    loaderService.show();

    const toastrService = inject(ToastrService);
    const router = inject(Router);

    const id = route.paramMap.get('id') || '';
    const res = inject(CardListService).getById(id).pipe(
        tap((c) => {
            loaderService.hide();
            if (!c) {
                toastrService.error('La lista no existe', 'Error')
                router.navigate(['/home']);
            }
        })
    )
    return res;
}