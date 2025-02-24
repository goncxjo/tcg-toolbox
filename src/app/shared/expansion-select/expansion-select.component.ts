import { AfterViewInit, Component, DoCheck, forwardRef, Injector, Input, OnInit, ViewChild, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NgControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as _ from 'lodash';
import { TcgPlayerService } from 'src/app/backend';
import { ExpansionTcgPlayer } from 'src/app/backend/models/tcg-player';

@Component({
  selector: 'app-expansion-select',
  templateUrl: './expansion-select.component.html',
  styleUrls: ['./expansion-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ExpansionSelectComponent),
      multi: true
    },
  ]
})
export class ExpansionSelectComponent implements OnInit, ControlValueAccessor, DoCheck, AfterViewInit {
  value!: ExpansionTcgPlayer;
  control!: NgControl;
  isDisabled!: boolean;

  @Input() mostrarOpcionTodos: boolean = true;
  @Input() esPreRelease: boolean = false;

  data$: ExpansionTcgPlayer[] = [];

  @ViewChild('input', { static: false, read: NgControl }) input: any;

  onChange = (_: any) => { }
  onTouch = () => { }

  constructor(
    private injector: Injector,
    private tcgPlayerService: TcgPlayerService
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

  writeValue(value: ExpansionTcgPlayer): void {
    this.value = value;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  ngOnInit(): void {
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

  compareSelectedValue(item: ExpansionTcgPlayer, value: ExpansionTcgPlayer) {
    return (!item || !value) ? false : item.setNameId === value.setNameId;
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if(propName != 'mostrarOpcionTodos') {
        const changedProp = changes[propName];
        if (changedProp.isFirstChange()) {
          this.refreshData(false);
        } else {
          const from = JSON.stringify(changedProp.previousValue);
          const to = JSON.stringify(changedProp.currentValue);
          if(to != from) this.refreshData(true);
        }
      }
    }
  }

  private refreshData(refreshValue: boolean) {
    this.tcgPlayerService.getDigimonExpansions().subscribe((data: ExpansionTcgPlayer[]) => {
      this.data$ = _.filter(data, (d: ExpansionTcgPlayer) => {
        if (this.esPreRelease) {
          return d.abbreviation.includes("_PR");
        }
        return !d.abbreviation.includes("_PR");
      })
      
      if (this.value && refreshValue) {
        this.value = data[0];
      }
    });
  }
}
