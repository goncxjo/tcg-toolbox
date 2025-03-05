import { inject } from "@angular/core";
import { ResolveFn, Router } from "@angular/router";
import { CardList, CardListService } from "../../backend";
import { tap } from "rxjs";
import { UserService } from "../../core";

export const getByIdResolver: ResolveFn<Object> = (route, state) => {
    const id = route.paramMap.get('id') || '';
    const userId = inject(UserService).getUserId();
    const router = inject(Router);
    return inject(CardListService).getById(id).pipe(
        tap((c: CardList) => {
            console.log(userId,c.user)
            if (route.data['editMode'] && userId !== c.user) {
                router.navigate(['/home']);
            }
        })
    );
}