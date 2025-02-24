import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { PostService } from "../../backend";

export const getByIdResolver: ResolveFn<Object> = (route, state) => {
    const id = route.paramMap.get('id') || '';
    return inject(PostService).getById(id)
}