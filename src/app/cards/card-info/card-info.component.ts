import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { TcgPlayerService } from 'src/app/backend';
import { Card, CardPrice, Dolar } from 'src/app/backend/models';
import { style, transition, trigger, animate } from '@angular/animations';

@Component({
  selector: 'app-card-info',
  templateUrl: './card-info.component.html',
  styleUrls: ['./card-info.component.scss'],
  animations: [
    trigger('myInsertTrigger', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('250ms', style({ opacity: 1 })),
      ]),
    ]),
  ]
})
export class CardInfoComponent implements OnInit, OnDestroy, OnChanges {
  @Input() data!: Card;
  @Input() dolar!: Dolar;
  @Input() dolarChanged: any;
  @Output() priceChangeEvent = new EventEmitter<boolean>();
  @Output() cardRemovedEvent = new EventEmitter<number>();

  priceSelected: string = "custom";
  custom_price: number = 0;

  constructor(
    private tcgPlayerService: TcgPlayerService
  ) { }

  ngOnInit(): void {
  }

  async loadTcgPlayerPrices() {
    if (this.data.tcg_player_id) {
      const tcgPlayerPrice$ = this.tcgPlayerService.getCardPrices(this.data.tcg_player_id);
      const tcg_player_prices = await firstValueFrom(tcgPlayerPrice$);

      if (tcg_player_prices[1].tcg_player_foil) {
        this.priceSelected = 'tcg_player_foil_listed_median';
        this.data.prices.set('tcg_player_foil_listed_median', tcg_player_prices[1].tcg_player_foil);
      }
      if (tcg_player_prices[1].tcg_player_normal) {
        this.priceSelected = 'tcg_player_normal_listed_median';
        this.data.prices.set('tcg_player_normal_listed_median', tcg_player_prices[1].tcg_player_normal);
      }      
      if (tcg_player_prices[0].tcg_player_foil) {
        this.priceSelected = 'tcg_player_foil';
        this.data.prices.set('tcg_player_foil', tcg_player_prices[0].tcg_player_foil);
      }
      if (tcg_player_prices[0].tcg_player_normal) {
        this.priceSelected = 'tcg_player_normal';
        this.data.prices.set('tcg_player_normal', tcg_player_prices[0].tcg_player_normal);
      }
    }
  }

  async loadCustomPrice() {
      const customPrice = this.data.prices.get('custom');
      if (customPrice) {
        this.custom_price = customPrice.currency_value;
        if (customPrice.currency_value) {
          this.priceSelected = 'custom';
        }
      }
  }

  async ngAfterViewInit() {
    await this.loadTcgPlayerPrices();
    await this.loadCustomPrice();
    this.setPrecioCarta();
  }

  getPrecioCarta() {
    const price = this.data.prices.get(this.priceSelected);
    if (price?.currency_symbol == 'USD') {
      return Math.round(price.currency_value * this.dolar.venta * 100) / 100;
    }
    return price?.currency_value || 0;
  }

  setPrecioCarta() {
    this.data.price.currency_value = this.getPrecioCarta();
    this.priceChangeEvent.emit(true);
  }

  esUnidad() {
    return this.data.multiplier == 1;
  }

  getPrecioCartaTotal() {
    return this.getPrecioCarta() * this.data.multiplier;
  }
  
  getPrecioCartaUSD() {
    return Math.round(this.getPrecioCarta() / this.dolar.venta * 100) / 100;
  }
  
  getPrecioCartaTotalUSD() {
    return this.getPrecioCartaUSD() * this.data.multiplier;
  }


  onPriceSelected(priceSelected: string) {
    this.priceSelected = priceSelected;
    this.setPrecioCarta();
  }
  
  onCustomPriceChange($event: any) {
    this.data.prices.set('custom', new CardPrice('ARS', this.custom_price));
    this.setPrecioCarta();
  }

  ngOnDestroy(): void {
  }

  remove(item: Card) {
    if (item.tcg_player_id) {
      this.cardRemovedEvent.emit(item.tcg_player_id);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (propName == 'dolarChanged') {
        this.setPrecioCarta();
      }
    }
  }
}
