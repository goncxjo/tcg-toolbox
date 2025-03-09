import { AfterViewInit, Component, inject, OnDestroy, ViewChild } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRight, faSearch, faSliders, faTimes, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { NgbActiveModal, NgbHighlight } from '@ng-bootstrap/ng-bootstrap';
import { Card, FiltersTcgPlayerQuery, PageResult, TcgPlayerService } from '../../../backend';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, Observable, Subscription, catchError, debounceTime, iif, of, switchMap, take, takeLast, tap } from 'rxjs';
import _ from 'lodash';
import { AsyncPipe } from '@angular/common';
import { CardSearchFiltersComponent } from '../card-search-filters/card-search-filters.component';
import { DataService } from '../../../core/services/data.service';
import { cardsStorage } from '../../../utils/type-safe-localstorage/card-storage';
import { CardListFiltersComponent } from '../../../pages/price-calc/card-lists/card-list-filters/card-list-filters.component';

@Component({
  selector: 'app-card-search-modal',
  standalone: true,
  imports: [ReactiveFormsModule, FontAwesomeModule, NgbHighlight, AsyncPipe, CardSearchFiltersComponent],
  templateUrl: './card-search-modal.component.html',
  styleUrl: './card-search-modal.component.scss',
})
export class CardSearchModalComponent implements AfterViewInit, OnDestroy {
  searchIcon = faSearch;
  warningIcon = faTriangleExclamation;
  filtersIcon = faSliders;
  closeIcon = faTimes;
  goIcon = faArrowRight

  @ViewChild('cardSearchFilters') filters!: CardListFiltersComponent;
	activeModal = inject(NgbActiveModal);
  
  searchCard$ = new BehaviorSubject<string>('');
  cardSearchTextInput = new FormControl();
  searching = false;
  filterSub!: Subscription;

  get term() {
    return this.cardSearchTextInput.value;
  }
  get noCards() {
    return this.selectedCards.length === 0;
  }

  get isUpdateMode() {
    return this.dataService.updateMode;
  }
  
  resultCards: Card[] = [];
  selectedCards: Card[] = [];
  page: number = 1;
  pageSize: number = 20;

  form = this.buildForm();
  mostrarBusquedaAvanzada = false;  

  constructor(
    private tcgPlayerService: TcgPlayerService,
    private formBuilder: FormBuilder,
    private dataService: DataService
  ) {
    if (!this.dataService.cardsLength()) {
      const tmpCards = cardsStorage.getItems() as Card[]
      this.dataService.set(tmpCards);
    }
    setTimeout(() => {
      this.selectedCards = _.clone(this.dataService.cards())
    }, 1000);
  }

  applyFilter(continueSearch: boolean = false) {
    this.page = continueSearch ? this.page + 1 : 1;
    this.searchCard$.next(this.cardSearchTextInput.value)
  }

  cards$: Observable<PageResult<Card>> = this.searchCard$.pipe(
    tap(() => this.searching = true),
    debounceTime(300),
    switchMap((term) => iif(
      () => (term == '' || term.length < 3),
      of({ total: 0, result: []} as PageResult<Card>),
      this.tcgPlayerService.getCards(term, this.mapFilters(), this.page, this.pageSize))
    ),
    catchError(() => of({ total: 0, result: []} as PageResult<Card>)),
    tap((res) => (this.page > 1) ? this.resultCards.push(...res.result) : this.resultCards = res.result),
    tap(() => this.searching = false),
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
      isPreRelease: values?.esPreRelease,
      productLineName: values?.game ? [values?.game] : [],
      productTypeName: ['Cards'],
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
    this.activeModal.close('new');  }

  add() {
    this.sendData();
    this.activeModal.close('add');
  }

  clearTerm() {
    this.cardSearchTextInput.setValue('');
  }

  ngAfterViewInit() {
    this.filterSub = this.filters.childForm.valueChanges.pipe(
      take(1)
    ).subscribe(res => {
      this.applyFilter();
    })
  }

  ngOnDestroy() {
    this.filterSub.unsubscribe();
  }
}

