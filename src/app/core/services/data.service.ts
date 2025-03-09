import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { Card, CardPrice, TcgPlayerService } from '../../backend';
import _ from 'lodash';
import { forkJoin } from 'rxjs';
import { DolarDataService } from './dolar.data.service';
import { cardsStorage } from '../../utils/type-safe-localstorage/card-storage';
import { CardExport } from '../../utils/type-safe-localstorage/types';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  readonly #cards = signal<Card[]>([]);

  readonly cards = computed(this.#cards);
  readonly cardsLength = computed(() => this.#cards().length);
  readonly totals = computed(() => {
    return _.sumBy(this.cards(), (c) => {
      return this.getPrice(c) * c.multiplier;
    });
  });

  updateMode: boolean = false;

  private tcgPlayerService = inject(TcgPlayerService);
  private dolarService = inject(DolarDataService);

  constructor() {
    effect(() => {
      if (this.cardsLength() > 0 && !this.updateMode) {
        cardsStorage.setItems(this.getAllMiniCard());  
      }
    })
  }

  update(cards: Card[]) {
    cards.forEach(card => this.add(card));
  }

  set(cards: Card[]) {
    this.clear();
    this.update(cards);
  }

  setFromTmp(tmpCards: CardExport[]) {
    this.clear();
    
    const _cards = _.map(tmpCards, (t) => {
      const card = new Card();
      card.tcg_player_id = t.tcgPlayerId;
      card.multiplier = t.qty;
      card.selectedPrice = t.selectedPrice;
      card.prices.set('custom', this.getCustomPrice(t.customCurrency, t.customPrice));
      return card;
    });

    this.update(_cards);
  }

  private getCustomPrice(currency: string, value: number) {
    const customPrice = new CardPrice();
    customPrice.currency_symbol = currency ?? 'ARS';
    customPrice.currency_value = value ?? 0;
    return customPrice;
  }

  clear() {
    this.#cards.set([]);
  }

  add(card: Card): void {
    const tcg_player_id = card.tcg_player_id || card.tcgPlayerId || 0;
    const qty = card.multiplier || card.qty;
    const alreadyExists = _.some(this.#cards(), (c) => c.tcg_player_id === card.tcg_player_id);
    if (!alreadyExists) {      
      const info = this.tcgPlayerService.getCardById(tcg_player_id);
      const price = this.tcgPlayerService.getCardPrice(tcg_player_id);

      forkJoin([info, price]).subscribe(result => {
        const cardResult = result[0];
        const priceResult = result[1];

        cardResult.multiplier = qty;
        
        if (priceResult.tcg_player_foil) {
          cardResult.selectedPrice = 'tcg_player_foil'; 
          cardResult.prices.set('tcg_player_foil', priceResult.tcg_player_foil);
        }
        if (priceResult.tcg_player_normal) {
          cardResult.selectedPrice = 'tcg_player_normal'; 
          cardResult.prices.set('tcg_player_normal', priceResult.tcg_player_normal);
        }
        if (card.selectedPrice == 'custom' && card.customPrice) {
          cardResult.selectedPrice = 'custom';
          cardResult.customCurrency = card.customCurrency;
          cardResult.customPrice = card.customPrice;
          cardResult.prices.set('custom', this.getCustomPrice(card.customCurrency, card.customPrice));
        }

        this.#cards.update(cards => [...cards, cardResult]);
      });
    }
  }

  remove(card: Card) {
    this.#cards.update((cards) => {
      return _.filter(cards, (c) => c.tcg_player_id !== card.tcg_player_id);
    });
    if (this.cardsLength() === 0 && !this.updateMode) {
      cardsStorage.clearItems();  
    }

  }

  updateCardMultiplier(card: Card, i: number) {
    this.#cards.update((cards) => {
      return _.map(cards, (c) => {
        if (c.tcg_player_id == card.tcg_player_id) {
          c.changeMultiplier(i);
        }
        return c;
      });
    });
  }

  getPrice(card: Card) {
    const price = card.getPrecioOrDefault();
    return this.dolarService.convertToDolars(price);
  }

  setPrice(card: Card) {
    this.#cards.update((cards) => {
      return _.map(cards, (c) => {
        if (c.tcg_player_id == card.tcg_player_id) {
          c.selectedPrice = card.selectedPrice;
          const customPrice = card.prices.get('custom');
          if (customPrice) {
            card.prices.delete('custom');
            card.prices.set('custom', customPrice);
          }
        }
        return c;
      });
    });
  }

  private getMiniCard(card: Card): CardExport {
    return {
      tcgPlayerId: card.tcg_player_id ?? 0,
      qty: card.multiplier,
      selectedPrice: card.selectedPrice,
      customCurrency: card.prices?.get('custom')?.currency_symbol ?? 'ARS',
      customPrice: card.prices?.get('custom')?.currency_value ?? 0
    }
  }
  
  public getAllMiniCard() {
    return _.map(this.#cards(), (card) => this.getMiniCard(card));
  }
}
