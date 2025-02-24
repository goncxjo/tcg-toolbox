import { AfterContentInit, AfterViewInit, Component, DoCheck, forwardRef, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, NgControl, NG_VALUE_ACCESSOR, FormsModule, ReactiveFormsModule, ControlContainer, FormGroupDirective, FormControl } from '@angular/forms';

@Component({
  selector: 'app-currency-select',
  templateUrl: './currency-select.component.html',
  styleUrls: ['./currency-select.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ]
})
export class CurrencySelectComponent implements AfterContentInit {
  childForm: any;
  
  @Input() isDisabled: boolean = false;
  @Input() showOptionAll: boolean = false;
  @Input() name: string = '';
  @Input() innerLabel: string = "";
  
  constructor(
    public parentForm: FormGroupDirective
  ) { }

  ngAfterContentInit(): void {
    this.childForm = this.parentForm.form;
    this.childForm.addControl(this.name, new FormControl({value: '', disabled: this.isDisabled}));
  }
}
