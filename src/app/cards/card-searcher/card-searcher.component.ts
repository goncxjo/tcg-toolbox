import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as _ from 'lodash';
import { Observable, OperatorFunction, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { Card, FiltersTcgPlayerQuery } from 'src/app/backend';
import { TcgPlayerService } from 'src/app/backend/services/tcg-player.service';

@Component({
  selector: 'app-card-searcher',
  templateUrl: './card-searcher.component.html',
  styleUrls: ['./card-searcher.component.scss'],
  animations: [
    trigger('myInsertRemoveTrigger', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('200ms', style({ opacity: 0 }))
      ])
    ]),
  ]
})
export class CardSearcherComponent implements OnInit {
  form = this.buildForm();

  public model?: Card;
  data: Card[] = [];
  @Output() card = new EventEmitter<Card>();
  @ViewChild('cardSearcherInput') cardSearcherInput!: ElementRef;

  searching = false;
	searchFailed = false;
  mostrarBusquedaAvanzada = false;
  esPreRelease = false;

  constructor(
    private tcgPlayerService: TcgPlayerService,
    private formBuilder: FormBuilder,
  ) { }

  search: OperatorFunction <string, readonly Card[]> = (text$: Observable <string> ) =>
    text$.pipe(
			debounceTime(300),
			distinctUntilChanged(),
			tap(() => (this.searching = true)),
			switchMap((term) =>
				this.tcgPlayerService.getDigimonCards(term, this.mapFilters()).pipe(
					tap(() => (this.searchFailed = false)),
					catchError(() => {
						this.searchFailed = true;
						return of([]);
					}),
				),
			),
			tap(() => (this.searching = false)),
    );

    formatter = (card: Card) => card.fullName;

  ngOnInit(): void {
  }  

  agregarCarta() {
    setTimeout(() => {
      this.card.emit(this.model);
      delete this.model;
    }, 0);
  }

  blurInput() {
    this.cardSearcherInput.nativeElement.blur();
  }

  toggleBusquedaAvanzada() {
    this.mostrarBusquedaAvanzada = !this.mostrarBusquedaAvanzada;
    if(!this.mostrarBusquedaAvanzada) {
      this.form.reset();
      this.esPreRelease = false;
    }
  }

  private buildForm(): FormGroup {
    return this.formBuilder.group({
      expansion: [''],
      category: [''],
      colors: [''],
      rarities: [''],
      isPreRelease: [''],
    });
  }

  mapFilters(): FiltersTcgPlayerQuery {
    var values = this.form.getRawValue();
    return {
      expansions: values?.expansion?.urlName ? [values?.expansion?.urlName] : [],
      categories: values?.category?.id ? [values?.category?.id] : [],
      colors: _.map(values?.colors, 'id'),
      rarities: _.map(values?.rarities, 'id'),
      isPreRelease: this.esPreRelease
    }
  }

  onIsPreReleaseChanged($event: any) {
    this.esPreRelease = $event.target.checked;
  }    
}
