import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { Card, TcgPlayerService } from '../../backend';
import _ from 'lodash';
import { forkJoin } from 'rxjs';
import { DolarDataService } from './dolar.data.service';
import { cardsStorage } from '../../utils/type-safe-localstorage/card-storage';

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
        
        cardResult.selectedPrice = 'custom'; 
        cardResult.prices.set('custom', cardResult.prices.get('custom') || null);
        if (priceResult.tcg_player_foil) {
          cardResult.selectedPrice = 'tcg_player_foil'; 
          cardResult.prices.set('tcg_player_foil', priceResult.tcg_player_foil);
        }
        if (priceResult.tcg_player_normal) {
          cardResult.selectedPrice = 'tcg_player_normal'; 
          cardResult.prices.set('tcg_player_normal', priceResult.tcg_player_normal);
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

  private getMiniCard(card: Card) {
    return {
      tcgPlayerId: card.tcg_player_id ?? 0,
      qty: card.multiplier,
    }
  }
  
  private getAllMiniCard() {
    return _.map(this.#cards(), (card) => this.getMiniCard(card));
  }
}
