import { Injectable } from '@angular/core';
import { Card, PageResult } from '../models';
import { SearchProductResultTcgPlayer, SearchTcgPlayer } from '../models/tcg-player';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  constructor() { }

  public getListTcgPlayerCards(response$: Observable<SearchTcgPlayer>, imageEndpoint: string, productUrl: string): Observable<PageResult<Card>> {
    return response$.pipe(
      map((response: SearchTcgPlayer) => {
        const total = response.results[0].totalResults;
        const searchResults: SearchProductResultTcgPlayer[] = response.results[0].results;
        let cards: Card[] = [];
        searchResults.forEach(res => {
          try {
            const card = new Card();
            card.setFromTcgPlayer(res, imageEndpoint, productUrl);
            cards.push(card);            
          } catch (error) {
            console.log(`ocurrió un error al obtener información de la carta #${res.productId}`);
          }
        });
        return {
          total: total,
          result: cards
        };
      })
      )
    }
    
  public getTcgPlayerCard(response$: Observable<SearchTcgPlayer>, imageEndpoint: string, productUrl: string): Observable<Card> {
    return response$.pipe(
      map((res: SearchTcgPlayer) => {
        const card = new Card();
        card.setFromTcgPlayer(res, imageEndpoint, productUrl);
        return card;
      })
    );
  }
}