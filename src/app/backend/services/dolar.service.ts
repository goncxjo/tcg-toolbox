import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as rxjs from 'rxjs';
import { DivisasBluelytics, Dolar } from '../models';
import { AppConfigService } from '../../core';

@Injectable({
    providedIn: 'root'
})
export class DolarService {
    private baseRoute: string;

    constructor(
        private httpClient: HttpClient,
        private appConfigService: AppConfigService,
    ) {
        this.baseRoute = this.appConfigService.config.DOLAR_API_BASE_URL;
    }
  
    getDolarBlue(): rxjs.Observable<Dolar> {
        const url = `${this.baseRoute}`;
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
        })
        return this.httpClient.get<DivisasBluelytics>(url, { headers: headers }).pipe(
            rxjs.map((d: DivisasBluelytics) => {
                return {
                    compra: d.blue.value_buy,
                    venta: d.blue.value_sell,
                    nombre: 'blue',
                    fechaActualizacion: d.last_update
                } as Dolar;
            })
        );
    }

}