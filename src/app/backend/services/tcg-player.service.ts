import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { AppConfigService } from 'src/app/core';
import { Card, CardPrice } from '../models';
import { CardPriceTcgPlayer, CardPriceTcgPlayerType, ExpansionTcgPlayer, ProductPriceTcgPlayer, SearchTcgPlayer } from '../models/tcg-player';
import * as _ from 'lodash';
import { FiltersTcgPlayerQuery, createTcgPlayerQuery } from './tcg-player-search-query';
import { CardService } from './card.service';

@Injectable({
    providedIn: 'root'
})
export class TcgPlayerService {
    private searchEndpoint: string;
    private priceEndpoint: string;
    private imageEndpoint: string;
    private productUrl: string;

    constructor(
        private httpClient: HttpClient,
        private appConfigService: AppConfigService,
        private cardService: CardService,
    ) {
        this.searchEndpoint = this.appConfigService.config.TCG_PLAYER_API_SEARCH_ENDPOINT;
        this.priceEndpoint = this.appConfigService.config.TCG_PLAYER_API_PRICE_ENDPOINT;
        this.imageEndpoint = this.appConfigService.config.TCG_PLAYER_API_IMAGE_ENDPOINT;
        this.productUrl = this.appConfigService.config.TCG_PLAYER_PRODUCT_URL;
    }
  
    public getDigimonCards(value: string, filters: FiltersTcgPlayerQuery): Observable<Card[]> {
        if (value == '' || value.toLocaleLowerCase() == 'mon' || value.length < 3) {
            return of<Card[]>([]);
        }

        if(filters.isPreRelease && filters.expansions.length == 0) {
            value = value.concat(' Pre-Release');
        }

        const url = `${this.searchEndpoint}/search/request`;
        const params = {
            q: value,
            isList: true
        };
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
        });
        var query = createTcgPlayerQuery(0, filters);

        const response$ = this.httpClient.post<SearchTcgPlayer>(url, JSON.stringify(query), { params: params, headers: headers });
        return this.cardService.getListTcgPlayerCards(response$, this.imageEndpoint, this.productUrl);
    }

    public getDigimonCardById(tcg_player_id: number): Observable<Card> {
        const url = `${this.searchEndpoint}/product/${tcg_player_id}/details`;
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
        });
        const response$ = this.httpClient.get<SearchTcgPlayer>(url, { headers: headers });
        return this.cardService.getTcgPlayerCard(response$, this.imageEndpoint, this.productUrl);
    }


    public getCardPrices(tcg_player_id: number): Observable<CardPriceTcgPlayer[]> {
        const url = `${this.priceEndpoint}/product/${tcg_player_id}/pricepoints`;
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
        });
        return this.httpClient.get<ProductPriceTcgPlayer[]>(url, { headers: headers }).pipe(
            map((res: ProductPriceTcgPlayer[]) => {
                let tcg_player_normal_mp = new CardPrice('USD', res[0].marketPrice);
                let tcg_player_foil_mp = new CardPrice('USD', res[1].marketPrice);

                let tcg_player_normal_lmp = new CardPrice('USD', res[0].listedMedianPrice);
                let tcg_player_foil_lmp = new CardPrice('USD', res[1].listedMedianPrice);    
                
                return [
                    {
                        tcg_player_normal: tcg_player_normal_mp.currency_value != null ? tcg_player_normal_mp : null,
                        tcg_player_foil: tcg_player_foil_mp.currency_value != null ? tcg_player_foil_mp : null
                    },
                    {
                        tcg_player_normal: tcg_player_normal_lmp.currency_value != null ? tcg_player_normal_lmp : null,
                        tcg_player_foil: tcg_player_foil_lmp.currency_value != null ? tcg_player_foil_lmp : null
                    },
                ];
            })
        );
    }


    public getCardPrice(tcg_player_id: number, type: string = CardPriceTcgPlayerType.MARKET_PRICE): Observable<CardPriceTcgPlayer> {
        const url = `${this.priceEndpoint}/product/${tcg_player_id}/pricepoints`;
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
        });
        return this.httpClient.get<ProductPriceTcgPlayer[]>(url, { headers: headers }).pipe(
            map((res: ProductPriceTcgPlayer[]) => {
                let tcg_player_normal: CardPrice;
                let tcg_player_foil: CardPrice;

                if (type == CardPriceTcgPlayerType.LISTED_MEDIAN_PRICE) {
                    tcg_player_normal = new CardPrice('USD', res[0].listedMedianPrice);
                    tcg_player_foil = new CardPrice('USD', res[1].listedMedianPrice);                    
                } else {
                    tcg_player_normal = new CardPrice('USD', res[0].marketPrice);
                    tcg_player_foil = new CardPrice('USD', res[1].marketPrice);
                }
                
                return {
                    tcg_player_normal: tcg_player_normal.currency_value != null ? tcg_player_normal : null,
                    tcg_player_foil: tcg_player_foil.currency_value != null ? tcg_player_foil : null
                };
            })
        );
    }

    public getDigimonExpansions(): Observable<ExpansionTcgPlayer[]> {
        const url = `${this.priceEndpoint}/Catalog/SetNames?active=true&categoryId=63&mpfev=2196`;
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
        });
        return this.httpClient.get<any>(url, { headers: headers }).pipe(
            map((response: any) => {
                return _.sortBy(response.results, 'releaseDate').reverse();
            })
        );
    }
}