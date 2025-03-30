import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, concatMap, forkJoin, map, take } from 'rxjs';
import { BlueprintCardTrader, Card, ExpansionCardTrader, ProductCardTrader } from '../models';
import * as _ from 'lodash';
import { AppConfigService } from '../../core';

@Injectable({
    providedIn: 'root'
})
export class CardTraderService {
    private baseRoute: string;
    private token: string;

	private dataSubject = new BehaviorSubject<any>([]);
    data$ = this.dataSubject.asObservable();

    constructor(
        private httpClient: HttpClient,
        private appConfigService: AppConfigService,
    ) {
        this.baseRoute = this.appConfigService.config.CARD_TRADER_API_BASE_URL;
        this.token = this.appConfigService.config.CARD_TRADER_API_JWT_TOKEN;
    }
  
    getExpansions(): Observable<ExpansionCardTrader[]> {
        const url = `${this.baseRoute}/expansions`;

        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        })
        return this.httpClient.get<ExpansionCardTrader>(url, { headers: headers }).pipe(
            map((response: any) => {
                const filteredData = response.filter((item: ExpansionCardTrader) => {
                    return item.game_id === this.appConfigService.config.CARD_TRADER_API_GAME_ID;
                });
                return filteredData;            
            })
        );
    }
  
    getBlueprints(expansion_id: number): Observable<BlueprintCardTrader[]> {
        const url = `${this.baseRoute}/blueprints/export`;

        const params = { expansion_id };

        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        })
        return this.httpClient.get<BlueprintCardTrader[]>(url, { params: params, headers: headers });
    }

    /*
        TODO:
        No se encontró en la documentación de la API de CardTrader
        una manera de obtener todas las cartas en base a un `game_id`.
        Este endpoint itera sobre todas las expansiones de un `game_id` por parámetro
        y obteniendo todos sus `blueprints`. Esto exige realizar muchísimos request.
    */
    getAllDigimonCards(): Observable<Card[]> {
        return this.getExpansions().pipe(
            take(1),
            concatMap(expansions => 
                forkJoin(
                    expansions.map((e: ExpansionCardTrader) => this.getBlueprints(e.id).pipe(
                        map((blueprints: BlueprintCardTrader[]) => {
                            const filteredData = blueprints.filter((item: BlueprintCardTrader) => {
                                return item.category_id === this.appConfigService.config.CARD_TRADER_API_CATEGORY_ID;
                            });
                            return filteredData.map(b => {
                                return { ...b, expansion_name: e.name };
                            })
                        })
                    ))
                ).pipe(
                    map(allBlueprints => allBlueprints.reduce((acc, curr) => acc.concat(curr), []).map((blueprint: any) => {
                        return {
                            // id: uuid.v4(),
                            // name: blueprint.name,
                            // expansion_id: blueprint.expansion_id,
                            // rarity_code: blueprint.fixed_properties.digimon_rarity,
                            // collector_number: blueprint.fixed_properties.collector_number,
                            // image_url: blueprint.image_url,
                            // card_trader_id: blueprint.id,
                            // card_market_id: (blueprint.card_market_id || null) as number | null,
                            // tcg_player_id: (blueprint.tcg_player_id || null) as number | null,
                            // expansion_name: blueprint.expansion_name,
                            // rarity_name: blueprint.fixed_properties.digimon_rarity,
                            // fullName: `${blueprint.name} (${blueprint.collector_number})`,
                        } as Card;
                    }))
                )
            )
        );
    }

    getCardPrice(blueprint_id: number): Observable<number> {
        const url = `${this.baseRoute}/marketplace/products`;
        const params = { blueprint_id };
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        })
        return this.httpClient.get<any>(url, { params: params, headers: headers }).pipe(
            map((response: any) => {
                let price = Infinity;
                _.forEach(response, (res: any) => {
                    _.forEach(res, (p: ProductCardTrader) => {
                        if (p.price.currency_symbol == "$") {
                            let price_tmp = parseFloat(p.price.formatted.replace(p.price.currency_symbol, ""));
                            price = Math.min(price, price_tmp);                            
                        }
                    })
                })
                return price === Infinity ? 0 : price;
            })
        );
    }


	sendData(data: any) {
        this.dataSubject.next(data);
    }
}