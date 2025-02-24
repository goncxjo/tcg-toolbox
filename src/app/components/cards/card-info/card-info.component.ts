import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, computed, effect } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, debounceTime, distinctUntilChanged, firstValueFrom, map, of, switchMap, tap } from 'rxjs';
import { style, transition, trigger, animate } from '@angular/animations';
import { Card, CardPrice, Dolar, TcgPlayerService } from '../../../backend';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DolarDataService } from '../../../core/services/dolar.data.service';
import { DataService } from '../../../core/services/data.service';
import { faShareFromSquare } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-card-info',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './card-info.component.html',
  styleUrls: ['./card-info.component.scss'],
  animations: [
    trigger('myInsertTrigger', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('250ms', style({ opacity: 1 })),
      ]),
    ]),
  ]
})
export class CardInfoComponent implements AfterViewInit, OnDestroy {
  openUrlIcon = faShareFromSquare;
  @Input() data!: Card;
  
  customPriceInput = new FormControl();
  customPrice$!: Subscription;

  constructor(
    private dataService: DataService,
    private dolarService: DolarDataService
  ) {}

  ngAfterViewInit() {
    this.setPrecioCarta();

    this.customPrice$ = this.customPriceInput.valueChanges
    .pipe(
      debounceTime(300),
      distinctUntilChanged()
    )
    .subscribe(price => {
      this.data.prices.set('custom', new CardPrice('ARS', price));
      this.setPrecioCarta();
    });
  }

  getPrecioCarta() {
    return this.dataService.getPrice(this.data)
  }
  
  setPrecioCarta() {
    this.dataService.setPrice(this.data);
  }

  esUnidad() {
    return this.data.multiplier == 1;
  }

  getPrecioCartaTotal() {
    return this.getPrecioCarta() * this.data.multiplier;
  }
  
  onPriceSelected(priceSelected: string) {
    this.data.selectedPrice = priceSelected;
    this.setPrecioCarta();
  }

  ngOnDestroy(): void {
    this.customPrice$?.unsubscribe();
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   for (const propName in changes) {
  //     if (propName == 'dolarChanged') {
  //       this.setPrecioCarta();
  //     }
  //   }
  // }
}
