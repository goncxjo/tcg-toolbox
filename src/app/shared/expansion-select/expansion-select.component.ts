import { Component, Input, AfterContentInit } from '@angular/core';
import { FormControl, FormGroupDirective, ControlContainer, ReactiveFormsModule } from '@angular/forms';
import * as _ from 'lodash';
import { ExpansionTcgPlayer, TcgPlayerService } from '../../backend';
import { Observable, map } from 'rxjs';
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
export class ExpansionSelectComponent implements AfterContentInit {
  data$!: Observable<ExpansionTcgPlayer[]>;

  chlidForm: any;

  @Input() isDisabled: boolean = false;
  @Input() showOptionAll: boolean = false;
  @Input() name: string = '';

  private _esPreRelease!: boolean;
  @Input() set esPreRelease(value: boolean) {
    this._esPreRelease = value;
    this.data$ = this.tcgPlayerService.getDigimonExpansions().pipe(
      map((data: ExpansionTcgPlayer[]) => this.filterData(data))
    );
  }

  get esPreRelease(): boolean {
    return this._esPreRelease;
  }

  constructor(
    private tcgPlayerService: TcgPlayerService,
    public parentForm: FormGroupDirective
  ) { }

  filterData(data: ExpansionTcgPlayer[]): ExpansionTcgPlayer[] {
    return _.filter(data, (d: ExpansionTcgPlayer) => {
      if (this.esPreRelease) {
        return d.abbreviation.includes("_PR");
      }
      return !d.abbreviation.includes("_PR");
    })  
  }
  
  ngAfterContentInit(): void {
    this.chlidForm = this.parentForm.form;
    this.chlidForm.addControl(this.name, new FormControl({value: '', disabled: this.isDisabled}));
  }
}
