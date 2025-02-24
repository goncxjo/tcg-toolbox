import { Injectable } from '@angular/core';
import { Card } from '../models';
import { SearchProductResultTcgPlayer, SearchTcgPlayer } from '../models/tcg-player';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  constructor() { }

  public getListTcgPlayerCards(response$: Observable<SearchTcgPlayer>, imageEndpoint: string, productUrl: string): Observable<Card[]> {
    return response$.pipe(
      map((response: SearchTcgPlayer) => {
        const results: SearchProductResultTcgPlayer[] = response.results[0].results;
        let cards: Card[] = [];
        results.forEach(res => {
          try {
            const card = new Card();
            card.setFromTcgPlayer(res, imageEndpoint, productUrl);
            cards.push(card);            
          } catch (error) {
            console.log(`ocurrió un error al obtener información de la carta #${res.productId}`);
          }
        });
        return cards;
        // .sort((a, b) => {
        //   if (a.releaseDate != null && b.releaseDate != null) {
        //     if (a.releaseDate < b.releaseDate) return 1;
        //     if (a.releaseDate > b.releaseDate) return -1;
        //   }
        //   return 0;
        // });    
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