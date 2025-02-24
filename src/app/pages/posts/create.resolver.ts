import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { PostService } from "../../backend";

export const createResolver: ResolveFn<Object> = (route, state) => {
    return inject(PostService).new()
}