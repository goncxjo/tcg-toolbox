import { Component, computed, inject } from '@angular/core';
import { DataService } from '../../../core/services/data.service';
import { DolarDataService } from '../../../core/services/dolar.data.service';
import _ from 'lodash';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-total',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './total.component.html',
  styleUrl: './total.component.scss'
})
export class TotalComponent {
  dataService = inject(DataService);  
  dolarService = inject(DolarDataService);

  readonly precioTotal = computed(this.dataService.totals);

  readonly precioTotalUSD = computed(() => {
    return Math.round(this.precioTotal() / this.dolarService.venta * 100) / 100;
  });
}
