import { AfterContentInit, Component, Input, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ListItem } from '../../../backend/models/list-item';
import { ControlContainer, FormControl, FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-rarity-multiselect',
  templateUrl: './rarity-multiselect.component.html',
  styleUrls: ['./rarity-multiselect.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe, FormsModule],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ]
})
export class RarityMultiSelectComponent implements OnInit, AfterContentInit {
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
    this.data$ = this.getDigimonRarities();
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
