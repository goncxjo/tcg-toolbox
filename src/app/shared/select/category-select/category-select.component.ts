import { AfterContentInit, Component, Input, OnInit } from '@angular/core';
import { FormGroupDirective, ControlContainer, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { ListItem } from '../../../backend/models/list-item';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-category-select',
  templateUrl: './category-select.component.html',
  styleUrls: ['./category-select.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ]
})
export class CategorySelectComponent implements OnInit, AfterContentInit {
  data$!: Observable<ListItem[]>;

  chlidForm: any;

  @Input() isDisabled: boolean = false;
  @Input() showOptionAll: boolean = false;
  @Input() name: string = '';
  
  constructor(
    public parentForm: FormGroupDirective
  ) { }

  ngAfterContentInit(): void {
    this.chlidForm = this.parentForm.form;
    this.chlidForm.addControl(this.name, new FormControl({value: '', disabled: this.isDisabled}));
  }

  ngOnInit(): void {
    this.data$ = this.getDigimonCategories();
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
