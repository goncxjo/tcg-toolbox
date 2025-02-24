import { AfterViewInit, Component, DoCheck, forwardRef, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, NgControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { ListItem } from 'src/app/backend/models/list-item';

@Component({
  selector: 'app-rarity-multiselect',
  templateUrl: './rarity-multiselect.component.html',
  styleUrls: ['./rarity-multiselect.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RarityMultiSelectComponent),
      multi: true
    },
  ]
})
export class RarityMultiSelectComponent implements OnInit, ControlValueAccessor, DoCheck, AfterViewInit {
  values!: ListItem[];
  control!: NgControl;
  isDisabled!: boolean;

  data$: ListItem[] = [];

  @ViewChild('input', { static: false, read: NgControl }) input: any;

  onChange = (_: any) => { }
  onTouch = () => { }

  constructor(
    private injector: Injector
  ) {
    this.values = [];
  }

  ngDoCheck(): void {
    if (this.input && this.control) {
      if (this.control.touched) {
        this.input.control.markAsTouched();
      } else {
        this.input.control.markAsUntouched();
      }
    }
  }

  ngAfterViewInit() {
    if (this.control != null) {
      this.input.control.setValidators(this.control.control?.validator);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  writeValue(values: ListItem[]): void {
    this.values = values;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  ngOnInit(): void {
    this.getDigimonRarities().subscribe(data => {
      this.data$ = data;
    });
    this.control = this.injector.get(NgControl);
  }

  onModelChange(_event: any) {
    this.notifyValueChange();
  }

  notifyValueChange() {
    if (this.onChange) {
      this.onChange(this.values);
    }

    if (this.onTouch) {
      this.onTouch();
    }
  }

  getDigimonRarities(): Observable<ListItem[]> {
    return of([
      { id: "Common", name: "Common" },
      { id: "Uncommon", name: "Uncommon" },
      { id: "Rare", name: "Rare" },
      { id: "Super Rare", name: "Super Rare" },
      { id: "Secret Rare", name: "Secret Rare" },
      { id: "Promo", name: "Promo" },
    ]);
  }
}
