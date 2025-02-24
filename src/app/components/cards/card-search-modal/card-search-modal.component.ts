import { Component, OnDestroy, OnInit, effect, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch, faSliders, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { NgbActiveModal, NgbHighlight } from '@ng-bootstrap/ng-bootstrap';
import { Card, FiltersTcgPlayerQuery, TcgPlayerService } from '../../../backend';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, Observable, Subscription, catchError, debounceTime, distinctUntilChanged, of, switchMap, tap } from 'rxjs';
import _ from 'lodash';
import { AsyncPipe } from '@angular/common';
import { CardSearchFiltersComponent } from '../card-search-filters/card-search-filters.component';
import { DataService } from '../../../core/services/data.service';

@Component({
  selector: 'app-card-search-modal',
  standalone: true,
  imports: [ReactiveFormsModule, FontAwesomeModule, NgbHighlight, AsyncPipe, CardSearchFiltersComponent],
  templateUrl: './card-search-modal.component.html',
  styleUrl: './card-search-modal.component.scss',
})
export class CardSearchModalComponent {
  searchIcon = faSearch;
  warningIcon = faTriangleExclamation;
  filetersIcon = faSliders;

	activeModal = inject(NgbActiveModal);
  
  searchCard$ = new BehaviorSubject<string>('');
  cardSearchTextInput = new FormControl();
  searching = false;

  get term() {
    return this.cardSearchTextInput.value;
  }
  get noCards() {
    return this.selectedCards.length === 0;
  }

  get isUpdateMode() {
    return this.dataService.updateMode;
  }
  
  selectedCards: Card[] = [];

  form = this.buildForm();
  mostrarBusquedaAvanzada = false;  

  constructor(
    private tcgPlayerService: TcgPlayerService,
    private formBuilder: FormBuilder,
    private dataService: DataService
  ) {
    this.selectedCards = _.clone(this.dataService.cards())
  }

  doCardSearch() {
    this.searchCard$.next(this.cardSearchTextInput.value)
  }

  cards$: Observable<Card[]> = this.searchCard$.pipe(
    tap(() => (this.searching = true)),
    debounceTime(300),
    distinctUntilChanged(),
    switchMap((term) =>
      this.tcgPlayerService.getDigimonCards(term, this.mapFilters()).pipe(
        // tap(() => (this.searchFailed = false)),
        catchError(() => {
          // this.searchFailed = true;
          return of([]);
        }),
      ),
    ),
    tap(() => (this.searching = false)),
  );

  private buildForm(): FormGroup {
    return this.formBuilder.group({});
  }

  toggleBusquedaAvanzada() {
    this.mostrarBusquedaAvanzada = !this.mostrarBusquedaAvanzada;
    if(!this.mostrarBusquedaAvanzada) {
      this.form.reset();
      this.form.controls['isPreRelease'].setValue(false)
    }
  }

  mapFilters(): FiltersTcgPlayerQuery {
    var values = this.form.getRawValue();
    return {
      expansions: values?.expansion ? [values?.expansion] : [],
      categories: values?.category ? [values?.category] : [],
      colors: values?.colors,
      rarities: values?.rarities,
      isPreRelease: values?.esPreRelease
    }
  }

  toggleSelection(card: Card) {
    this.isSelectedCard(card) ? _.remove(this.selectedCards, (c) => c.tcg_player_id == card.tcg_player_id) : this.selectedCards.push(card);
  }

  isSelectedCard(card: Card): boolean {
    return _.some(this.selectedCards, ['tcg_player_id', card.tcg_player_id]);
  }

  getBackgroundImage(card: Card) {
    return `linear-gradient(to left, transparent, var(--bs-list-group-bg) 90%), url('${card['image_url']}')`
  }
  
  sendData() {
    this.dataService.update(this.selectedCards);
  }

  create() {
    this.sendData();
    this.activeModal.close('create');  }

  add() {
    this.sendData();
    this.activeModal.close('add');
  }
}

