import { patchState, signalStore, withComputed, withHooks, withMethods, withProps, withState } from '@ngrx/signals';
import { Card, CardPrice, CardPriceTypes, TcgPlayerService } from '../../backend';
import { computed, effect, inject } from '@angular/core';
import _ from 'lodash';
import { DolarDataService } from './dolar.data.service';
import { forkJoin } from 'rxjs';
import { cardsStorage } from '../../utils/type-safe-localstorage/card-storage';
import { CardExport } from '../../utils/type-safe-localstorage/types';

type CardListState = {
    cards: Card[];
    updateMode: boolean;
};

const initialState: CardListState = {
    cards: [],
    updateMode: false,
};

export const CardListStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withProps(() => ({
        dolarService: inject(DolarDataService),
    })),
    withComputed(({ dolarService, cards }) => ({
        cardListLength: computed(() => cards().length),
        total: computed(() => {
            return _.sumBy(cards(), (c) => {
                // getPrice
                const price = c.getPrecioOrDefault();
                return dolarService.convertToDolars(price) * c.multiplier;
            });
        }),
    })),
    withMethods(({ dolarService, ...store }, tcgPlayerService = inject(TcgPlayerService)) => ({
        // cards Management
        add(card: Card): void {
            const tcg_player_id = card.tcg_player_id || card.tcgPlayerId || 0;
            const qty = card.multiplier || card.qty;
            const alreadyExists = _.some(store.cards(), (c) => c.tcg_player_id === card.tcg_player_id);
            if (!alreadyExists) {
                const info = tcgPlayerService.getCardById(tcg_player_id);
                const price = tcgPlayerService.getCardPrices(tcg_player_id);

                forkJoin([info, price]).subscribe(result => {
                    const cardResult = result[0];
                    const priceResult = result[1];

                    cardResult.multiplier = qty;

                    // LISTED MEDIAN PRICE
                    if (priceResult[1].tcg_player_foil) {
                        cardResult.selectedPrice = card.selectedPrice || CardPriceTypes.TCG_PLAYER.LISTED_MEDIAN.FOIL;
                        cardResult.prices.set(CardPriceTypes.TCG_PLAYER.LISTED_MEDIAN.FOIL, priceResult[1].tcg_player_foil);
                    }
                    if (priceResult[1].tcg_player_normal) {
                        cardResult.selectedPrice = card.selectedPrice || CardPriceTypes.TCG_PLAYER.LISTED_MEDIAN.NORMAL;
                        cardResult.prices.set(CardPriceTypes.TCG_PLAYER.LISTED_MEDIAN.NORMAL, priceResult[1].tcg_player_normal);
                    }

                    // MARKET PRICE
                    if (priceResult[0].tcg_player_foil) {
                        cardResult.selectedPrice = card.selectedPrice || CardPriceTypes.TCG_PLAYER.MARKET.FOIL;
                        cardResult.prices.set(CardPriceTypes.TCG_PLAYER.MARKET.FOIL, priceResult[0].tcg_player_foil);
                    }
                    if (priceResult[0].tcg_player_normal) {
                        cardResult.selectedPrice = card.selectedPrice || CardPriceTypes.TCG_PLAYER.MARKET.NORMAL;
                        cardResult.prices.set(CardPriceTypes.TCG_PLAYER.MARKET.NORMAL, priceResult[0].tcg_player_normal);
                    }

                    // CUSTOM PRICE
                    if (card.selectedPrice == CardPriceTypes.CUSTOM && card.customPrice) {
                        cardResult.selectedPrice = card.selectedPrice;
                        cardResult.customCurrency = card.customCurrency;
                        cardResult.customPrice = card.customPrice;
                        cardResult.prices.set(CardPriceTypes.CUSTOM, this.getCustomPrice(card.customCurrency, card.customPrice));
                    }

                    patchState(store, { cards: [...store.cards(), cardResult] });
                });
            }
        },
        update(cards: Card[]) {
            cards.forEach(card => this.add(card));
        },
        set(cards: Card[]) {
            this.clear();
            this.update(cards);
        },
        remove(card: Card) {
            const filteredCardList = _.filter(store.cards(), (c) => c.tcg_player_id !== card.tcg_player_id);
            patchState(store, { cards: filteredCardList });
            if (store.cardListLength() === 0 && !store.updateMode) {
                cardsStorage.clearItems();
            }
        },
        clear: (): void => {
            patchState(store, { cards: [] });
        },
        setFromTmp(tmpCards: CardExport[]) {
            this.clear();

            const _cards = _.map(tmpCards, (t) => {
                const card = new Card();
                card.tcg_player_id = t.tcgPlayerId;
                card.multiplier = t.qty;
                card.selectedPrice = t.selectedPrice;
                card.customPrice = t.customPrice;
                card.prices.set(CardPriceTypes.CUSTOM, this.getCustomPrice(t.customCurrency, t.customPrice));
                return card;
            });

            this.update(_cards);
        },
        // Prices
        getPrice(card: Card) {
            const price = card.getPrecioOrDefault();
            return dolarService.convertToDolars(price);
        },
        getCustomPrice(currency: string, value: number) {
            const customPrice = new CardPrice();
            customPrice.currency_symbol = currency ?? 'ARS';
            customPrice.currency_value = value ?? 0;
            return customPrice;
        },
        setPrice(card: Card) {
            const updatedCardList = _.map(store.cards(), (c) => {
                if (c.tcg_player_id == card.tcg_player_id) {
                    c.selectedPrice = card.selectedPrice;
                    const customPrice = card.prices.get(CardPriceTypes.CUSTOM);
                    if (customPrice) {
                        card.prices.delete(CardPriceTypes.CUSTOM);
                        card.prices.set(CardPriceTypes.CUSTOM, customPrice);
                    }
                }
                return c;
            });
            patchState(store, { cards: updatedCardList });
        },
        // Multipliers
        updateCardMultiplier(card: Card, i: number) {
            const updatedCardList = _.map(store.cards(), (c) => {
                if (c.tcg_player_id == card.tcg_player_id) {
                    c.changeMultiplier(i);
                }
                return c;
            });
            patchState(store, { cards: updatedCardList });
        },
        // Others
        getMiniCard(card: Card): CardExport {
            return {
                tcgPlayerId: card.tcg_player_id ?? 0,
                qty: card.multiplier,
                selectedPrice: card.selectedPrice,
                customCurrency: card.prices?.get(CardPriceTypes.CUSTOM)?.currency_symbol ?? 'ARS',
                customPrice: card.prices?.get(CardPriceTypes.CUSTOM)?.currency_value ?? 0
            }
        },
        getAllMiniCard() {
            return _.map(store.cards(), (card) => this.getMiniCard(card));
        },
        setUpdateMode(mode: boolean) {
            patchState(store, { updateMode: mode });
        }
    })),
    withHooks({
        onInit(store) {
          effect(() => {
            if (store.cardListLength() > 0 && !store.updateMode()) {
                cardsStorage.setItems(store.getAllMiniCard());  
            }
          });
        },
      })
);
