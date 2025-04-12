import { Component, inject, Input } from '@angular/core';
import { Card, FiltersTcgPlayerQuery, PageResult, TcgPlayerService } from '../../../backend';
import { map, Observable, take } from 'rxjs';
import _ from 'lodash';
import { AsyncPipe } from '@angular/common';
import { CardListStore } from '../../../core/services/card-list.store';

@Component({
  selector: 'app-expansions',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './expansions.component.html',
  styleUrl: './expansions.component.scss'
})
export class ExpansionsComponent {
  data$!: Observable<Card[]>;
  selectedCards: Card[] = [];
  @Input() game: string = '';
  @Input() expansion: string = '';

  private dataService = inject(CardListStore)

  constructor(
    private tcgPlayerService: TcgPlayerService,
  ) {
    this.selectedCards = _.clone(this.dataService.cards())
  }

  applyFilter() {
    if (this.game) {
      this.data$ = this.tcgPlayerService.getCards('', this.mapFilters()).pipe(
        take(1),
        map((cards: PageResult<Card>) => cards.result)
      );
    }
  }

  ngAfterViewInit() {
    this.applyFilter();
  }

  mapFilters(): FiltersTcgPlayerQuery {
    return {
      expansions: [this.expansion],
      categories: [],
      colors: [],
      rarities: [],
      isPreRelease: false,
      productLineName: [this.game],
      productTypeName: ['Cards'],
    }
  }

  getBackgroundImage(card: Card) {
    return `linear-gradient(to left, transparent, var(--bs-list-group-bg) 90%), url('${card['image_url']}')`
  }
  
}
