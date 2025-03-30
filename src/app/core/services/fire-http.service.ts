import { inject, Injectable } from "@angular/core";
import { finalize, Observable } from "rxjs";
import { LoaderService } from "./loader.service";

@Injectable({ providedIn: 'root' })
export class FireHttpService {
    loaderService = inject(LoaderService);
    
    public run<T>(fn: Observable<any>): Observable<T> {

        this.loaderService.show();
        return fn
            .pipe(
                finalize(() => this.loaderService.hide()),
            );
    }
}