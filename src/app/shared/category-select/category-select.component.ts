import { AfterViewInit, Component, DoCheck, forwardRef, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, NgControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { ListItem } from 'src/app/backend/models/list-item';

@Component({
  selector: 'app-category-select',
  templateUrl: './category-select.component.html',
  styleUrls: ['./category-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CategorySelectComponent),
      multi: true
    },
  ]
})
export class CategorySelectComponent implements OnInit, ControlValueAccessor, DoCheck, AfterViewInit {
  value!: ListItem;
  control!: NgControl;
  isDisabled!: boolean;

  @Input() mostrarOpcionTodos: boolean = true;

  data$: ListItem[] = [];

  @ViewChild('input', { static: false, read: NgControl }) input: any;

  onChange = (_: any) => { }
  onTouch = () => { }

  constructor(
    private injector: Injector,
  ) { }

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

  writeValue(value: ListItem): void {
    this.value = value;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  ngOnInit(): void {
    this.getDigimonCategories().subscribe(data => {
      this.data$ = data;
    });
    this.control = this.injector.get(NgControl);
  }

  onModelChange(_event: any) {
    this.notifyValueChange();
  }

  notifyValueChange() {
    if (this.onChange) {
      this.onChange(this.value);
    }

    if (this.onTouch) {
      this.onTouch();
    }
  }

  compareSelectedValue(item: ListItem, value: ListItem) {
    return (!item || !value) ? false : item.id === value.id;
  }

  getDigimonCategories(): Observable<ListItem[]> {
    return of([
      { id: "Digimon", name: "Digimon" },
      { id: "Tamer", name: "Tamer" },
      { id: "Option", name: "Option" },
      { id: "Digi-Egg", name: "Digi-Egg" }
    ]);
  }

}
