import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { CardListService } from "../../backend";

export const getByIdResolver: ResolveFn<Object> = (route, state) => {
    const id = route.paramMap.get('id') || '';
    return inject(CardListService).getById(id)
}