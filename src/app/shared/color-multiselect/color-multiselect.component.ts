import { AfterViewInit, Component, DoCheck, forwardRef, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, NgControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { ListItem } from 'src/app/backend/models/list-item';

@Component({
  selector: 'app-color-multiselect',
  templateUrl: './color-multiselect.component.html',
  styleUrls: ['./color-multiselect.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ColorMultiSelectComponent),
      multi: true
    },
  ]
})
export class ColorMultiSelectComponent implements OnInit, ControlValueAccessor, DoCheck, AfterViewInit {
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
    this.getDigimonColors().subscribe(data => {
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

  getDigimonColors(): Observable<ListItem[]> {
    return of([
      { id: "Green", name: "Green"},
      { id: "Black", name: "Black"},
      { id: "Blue", name: "Blue"},
      { id: "Purple", name: "Purple"},
      { id: "Red", name: "Red"},
      { id: "Yellow", name: "Yellow"},
      { id: "White", name: "White"},
    ]);
  }
}
