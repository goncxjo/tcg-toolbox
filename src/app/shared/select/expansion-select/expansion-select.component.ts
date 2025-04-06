import { Component, Input, AfterContentInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroupDirective, ControlContainer, ReactiveFormsModule } from '@angular/forms';
import * as _ from 'lodash';
import { ExpansionTcgPlayer, Game, TcgPlayerService } from '../../../backend';
import { Observable, Subscription, debounceTime, distinctUntilChanged, map, of, take, tap } from 'rxjs';
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

  childForm: any;

  @Input() isDisabled: boolean = true;
  @Input() showOptionAll: boolean = false;
  @Input() name: string = '';
  susc!: Subscription;

  constructor(
    private tcgPlayerService: TcgPlayerService,
    public parentForm: FormGroupDirective
  ) { }

  ngAfterContentInit(): void {
    this.childForm = this.parentForm.form;
    this.childForm.addControl(this.name, new FormControl(''));
    this.ctrl.disable();

    this.susc = this.childForm.controls['game'].valueChanges
    .pipe(
      tap(() => this.ctrl.disable()),
      debounceTime(300),
      distinctUntilChanged()
    )
    .subscribe((value: string) => {
      if (value) {
        this.data$ = this.tcgPlayerService.getExpansions(value);
        this.ctrl.enable();
      }
      else {
        this.data$ = of([]);
        this.ctrl.setValue('');
      }
    });
  }

  get ctrl(): FormControl {
    return this.childForm.controls[this.name] as FormControl;
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
