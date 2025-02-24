import { Component, Input, AfterContentInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroupDirective, ControlContainer, ReactiveFormsModule } from '@angular/forms';
import * as _ from 'lodash';
import { ExpansionTcgPlayer, Game, TcgPlayerService } from '../../../backend';
import { Observable, Subscription, debounceTime, distinctUntilChanged, map, take, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-expansion-select',
  templateUrl: './expansion-select.component.html',
  styleUrls: ['./expansion-select.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ]
})
export class ExpansionSelectComponent implements AfterContentInit, OnDestroy {
  data$!: Observable<ExpansionTcgPlayer[]>;

  chlidForm: any;

  @Input() isDisabled: boolean = true;
  @Input() showOptionAll: boolean = false;
  @Input() name: string = '';
  susc!: Subscription;

  // private _game!: Game;
  // @Input() set game(value: Game) {
  //   if (value) {
  //     this._game = value;
  //     this.data$ = this.tcgPlayerService.getExpansions(this._game.name);
  //   }
  // }

  constructor(
    private tcgPlayerService: TcgPlayerService,
    public parentForm: FormGroupDirective
  ) { }

  ngAfterContentInit(): void {
    this.chlidForm = this.parentForm.form;
    this.chlidForm.addControl(this.name, new FormControl(''));
    this.ctrl.disable();
  }

  ngAfterViewChecked() {
    this.susc = this.chlidForm.controls['game'].valueChanges
    .pipe(
      tap(() => this.disableInput(true)),
      debounceTime(300),
      distinctUntilChanged()
    )
    .subscribe((value: string) => {
      if (value) {
        this.data$ = this.tcgPlayerService.getExpansions(value);
        this.disableInput(false)
      }
    });
  }

  get ctrl(): FormControl {
    return this.chlidForm.controls[this.name] as FormControl;
  }

  disableInput(value: boolean): void {
    value ? this.ctrl.disable() : this.ctrl.enable();
  }

  getExpansionImage(expansion: ExpansionTcgPlayer): string {
    return this.tcgPlayerService.getDigimonImageExpansionURL(expansion);
  }

  getBackgroundImage(expansion: ExpansionTcgPlayer) {
    const image_url = this.getExpansionImage(expansion);
    return `linear-gradient(to left, transparent, RGBA(var(--bs-dark-rgb)) 90%), url('${image_url}')`
  }

  ngOnDestroy() {
    this.susc.unsubscribe();
  }
}
