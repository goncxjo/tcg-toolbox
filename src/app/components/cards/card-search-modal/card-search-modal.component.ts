import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRight, faFilter, faSearch, faTimes, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { NgbActiveModal, NgbHighlight } from '@ng-bootstrap/ng-bootstrap';
import { Card, FiltersTcgPlayerQuery, PageResult, TcgPlayerService } from '../../../backend';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable, Subscription, catchError, debounceTime, distinctUntilChanged, of, tap } from 'rxjs';
import _ from 'lodash';
import { AsyncPipe, Location } from '@angular/common';
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
  @ViewChild('cardSearchFilters') filters!: CardListFiltersComponent;

  searchIcon = faSearch;
  warningIcon = faTriangleExclamation;
  filtersIcon = faFilter;
  closeIcon = faTimes;
  goIcon = faArrowRight

  form!: FormGroup;
  emptyResult = of({ total: 0, result: []} as PageResult<Card>);

  cardSearchTextInput = new FormControl();
  searching = false;
  termSub!: Subscription;
  filterSub!: Subscription;
  
  cards$!: Observable<PageResult<Card>>;

  resultCards: Card[] = [];
  selectedCards: Card[] = [];
  page: number = 1;
  pageSize: number = 20;

  mostrarBusquedaAvanzada = false;  

  get term() {
    return this.cardSearchTextInput.value;
  }

  get isValidTerm() {
    return this.term != '' && this.term.length >= 3;
  }

  clearTerm() {
    this.cardSearchTextInput.setValue('');
  }

  get noCards() {
    return this.selectedCards.length === 0;
  }

  get isUpdateMode() {
    return this.dataService.updateMode;
  }

  constructor(
    private tcgPlayerService: TcgPlayerService,
    private formBuilder: FormBuilder,
    private dataService: DataService,
    public activeModal: NgbActiveModal,
    private location: Location
  ) {
    if (!this.dataService.cardsLength()) {
      const tmpCards = cardsStorage.getItems()
      this.dataService.setFromTmp(tmpCards);
    }
    setTimeout(() => {
      this.selectedCards = _.clone(this.dataService.cards())
    }, 1000);
  }

  private buildForm(): FormGroup {
    return this.formBuilder.group({});
  }

  ngOnInit() {
    this.form = this.buildForm();
  }

  ngAfterViewInit() {
    this.filterSub = this.filters.childForm.valueChanges.pipe(
      distinctUntilChanged()
    ).subscribe(() => this.applyFilter());

    this.termSub = this.cardSearchTextInput.valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(300),
    ).subscribe(() => this.applyFilter());
  }

  applyFilter(continueSearch: boolean = false) {
    this.page = continueSearch ? this.page + 1 : 1;

    if (this.isValidTerm) {
      this.cards$ = this.tcgPlayerService.getCards(this.term, this.mapFilters(), this.page, this.pageSize).pipe(
        tap(() => this.searching = true),
        tap((res) => (this.page > 1) ? this.resultCards.push(...res.result) : this.resultCards = res.result),
        tap(() => this.searching = false),
        catchError(() => this.emptyResult),
      );  
    } else {
      this.cards$ = this.emptyResult;
    }
  }

  toggleBusquedaAvanzada() {
    this.mostrarBusquedaAvanzada = !this.mostrarBusquedaAvanzada;
    if(!this.mostrarBusquedaAvanzada) {
      this.form.reset();
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

  close() {
    this.location.back();
  }
  
  ngOnDestroy() {
    this.filterSub.unsubscribe();
    this.termSub.unsubscribe();
  }
}

