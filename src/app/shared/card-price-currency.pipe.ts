import { Pipe, PipeTransform } from '@angular/core';
import { Card } from '../backend';
import { DolarDataService } from '../core/services/dolar.data.service';

@Pipe({
  name: 'cardPriceCurrency',
  standalone: true
})
export class CardPriceCurrencyPipe implements PipeTransform {

  transform(value: Card, dolarService: DolarDataService, applyMultiplier: boolean = false): string {
    if (!value) return "0.00";

    const price = value.getPrecioOrDefault();
    let result = price?.currency_value || 0;
    if (dolarService.userCurrency() == 'ARS') {
      if (price?.currency_symbol == 'USD') {
        result = Math.round(price.currency_value * dolarService.venta * 100) / 100;
      }
    }
    return applyMultiplier ? (result * value.multiplier).toFixed(2) : result.toFixed(2);

  }
}
