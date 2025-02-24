import { AfterContentInit, Component, Input, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, ControlContainer, FormGroupDirective, FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { ListItem } from '../../backend/models/list-item';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-color-multiselect',
  templateUrl: './color-multiselect.component.html',
  styleUrls: ['./color-multiselect.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe, FormsModule],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ]

})
export class ColorMultiSelectComponent implements  OnInit, AfterContentInit {
  data$!: Observable<ListItem[]>;

  chlidForm: any;

  @Input() isDisabled: boolean = false;
  @Input() name: string = '';
  
  constructor(
    public parentForm: FormGroupDirective
  ) { }

  ngAfterContentInit(): void {
    this.chlidForm = this.parentForm.form;
    this.chlidForm.addControl(this.name, new FormControl({value: '', disabled: this.isDisabled}));
  }
  ngOnInit(): void {
    this.data$ = this.getDigimonColors();
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
