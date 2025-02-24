import { Component, Input } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ControlContainer, FormControl, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { CategorySelectComponent } from '../../../shared/category-select/category-select.component';
import { ColorMultiSelectComponent } from '../../../shared/color-multiselect/color-multiselect.component';
import { ExpansionSelectComponent } from '../../../shared/expansion-select/expansion-select.component';
import { RarityMultiSelectComponent } from '../../../shared/rarity-multiselect/rarity-multiselect.component';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-card-search-filters',
  standalone: true,
  imports: [ReactiveFormsModule, FontAwesomeModule, RarityMultiSelectComponent, ColorMultiSelectComponent, CategorySelectComponent, ExpansionSelectComponent],
  templateUrl: './card-search-filters.component.html',
  styleUrl: './card-search-filters.component.scss',
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
  animations: [
    trigger('myInsertRemoveTrigger', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('200ms', style({ opacity: 0 }))
      ])
    ]),
  ]
})
export class CardSearchFiltersComponent {
  infoIcon = faCircleExclamation;
  childForm: any;

  esPreRelease: boolean = false;
  @Input() isDisabled: boolean = false;
  
  constructor(
    public parentForm: FormGroupDirective,
  ) { }

  ngAfterContentInit(): void {
    this.childForm = this.parentForm.form;
    this.childForm.addControl('isPreRelease', new FormControl({ value: '', disabled: this.isDisabled }));
    this.childForm.addControl('expansion', new FormControl({ value: '', disabled: this.isDisabled }));
    this.childForm.addControl('category', new FormControl({ value: '', disabled: this.isDisabled }));
    this.childForm.addControl('colors', new FormControl({ value: '', disabled: this.isDisabled }));
    this.childForm.addControl('rarities', new FormControl({ value: '', disabled: this.isDisabled }));
  }

  onIsPreReleaseChanged($event: any) {
    this.esPreRelease = $event.target.checked;
  }    
}
