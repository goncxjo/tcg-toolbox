import { Injectable, signal } from '@angular/core';
import { CardPrice, Dolar, DolarService } from '../../backend';
import { take } from 'rxjs';
import _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class DolarDataService {
  private _dolar: Dolar | null = null;
  readonly dolar = signal<Dolar | null>(null);
  readonly userCurrency = signal<string>('ARS');

  constructor(
    private service: DolarService
  ) {
    this.getDolar();
  }

  getDolar(){
    this.service.getDolarBlue()
    .pipe(take(1))
    .subscribe((res: Dolar) => {
      this._dolar = res;
      this.dolar.set(_.clone(this._dolar));
    });
  }

  update(dolar: Dolar) {
    this.dolar.set(dolar);
  }

  updateVenta(venta: number) {
    const dolar = this.dolar() || this._dolar || {} as Dolar;
    dolar.venta = venta;
    console.log(dolar);
    this.dolar.set(dolar);
  }

  reset() {
    this.dolar.set(_.clone(this._dolar));
  }

  get venta() {
    return this.dolar()?.venta ?? 1;
  }

  setUserCurrency(currency: string) {
    this.userCurrency.set(currency);
  }

  convertToDolars(price: CardPrice | null | undefined) {
    if (this.userCurrency() == 'ARS' && price?.currency_symbol == 'USD') {
      return Math.round(price.currency_value * this.venta * 100) / 100;
    }
    return price?.currency_value || 0;
  }
}
