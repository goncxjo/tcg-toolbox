import { AfterViewInit, Component, inject, Input, OnDestroy } from '@angular/core';
import { Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { style, transition, trigger, animate } from '@angular/animations';
import { Card, CardPrice, CardPriceTypes } from '../../../backend';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faShareFromSquare } from '@fortawesome/free-solid-svg-icons';
import { CardListStore } from '../../../core/services/card-list.store';

@Component({
  selector: 'app-card-info',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, FontAwesomeModule],
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
export class CardInfoComponent implements AfterViewInit, OnDestroy {
  openUrlIcon = faShareFromSquare;
  @Input() data!: Card;
  
  customPriceInput = new FormControl();
  customPrice$!: Subscription;

  private cardListStore = inject(CardListStore)


  ngAfterViewInit() {
    this.setPrecioCarta();
    this.customPriceInput.setValue(this.data.customPrice);
    this.customPrice$ = this.customPriceInput.valueChanges
    .pipe(
      debounceTime(300),
      distinctUntilChanged()
    )
    .subscribe(price => {
      this.data.prices.set('custom', new CardPrice('ARS', price));
      this.setPrecioCarta();
    });
  }

  getPrecioCarta() {
    return this.cardListStore.getPrice(this.data)
  }
  
  setPrecioCarta() {
    this.cardListStore.setPrice(this.data);
  }

  esUnidad() {
    return this.data.multiplier == 1;
  }

  getPrecioCartaTotal() {
    return this.getPrecioCarta() * this.data.multiplier;
  }
  
  onPriceSelected(priceSelected: string) {
    this.data.selectedPrice = priceSelected;
    this.setPrecioCarta();
  }

  getPrecioSeleccionado() {
    switch(this.data.selectedPrice) {
      case CardPriceTypes.TCG_PLAYER.LISTED_MEDIAN.FOIL:
        return ['TCG Player', 'Median', 'Foil'];
      case CardPriceTypes.TCG_PLAYER.LISTED_MEDIAN.NORMAL:
        return ['TCG Player', 'Median'];
      case CardPriceTypes.TCG_PLAYER.MARKET.FOIL:
        return ['TCG Player', 'Market', 'Foil'];
      case CardPriceTypes.TCG_PLAYER.MARKET.NORMAL:
        return ['TCG Player', 'Market'];
      default:
        return ['Precio personalizado'];
    }
  }

  ngOnDestroy(): void {
    this.customPrice$?.unsubscribe();
  }
}
