import { Component, computed, inject } from '@angular/core';
import { DolarDataService } from '../../../core/services/dolar.data.service';
import { CurrencyPipe } from '@angular/common';
import { CardListStore } from '../../../core/services/card-list.store';

@Component({
  selector: 'app-total',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './total.component.html',
  styleUrl: './total.component.scss'
})
export class TotalComponent {
  cardListStore = inject(CardListStore);
  dolarService = inject(DolarDataService);

  readonly precioTotalUSD = computed(() => {
    return Math.round(this.cardListStore.total() / this.dolarService.venta * 100) / 100;
  });
}
