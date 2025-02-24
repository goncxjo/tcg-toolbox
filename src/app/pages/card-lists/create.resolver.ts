import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { CardListService } from "../../backend";

export const createResolver: ResolveFn<Object> = (route, state) => {
    return inject(CardListService).new()
}