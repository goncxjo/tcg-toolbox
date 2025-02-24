import { Component, Input } from '@angular/core';
import { ControlContainer, FormControl, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CardListFilters } from '../../../backend';

@Component({
  selector: 'app-card-list-filters',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FontAwesomeModule,
  ],
  templateUrl: './card-list-filters.component.html',
  styleUrl: './card-list-filters.component.scss',
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class CardListFiltersComponent {
  childForm: any;

  @Input() isDisabled: boolean = false;
  
  constructor(
    public parentForm: FormGroupDirective,
  ) { }

  ngAfterContentInit(): void {
    this.childForm = this.parentForm.form;
    this.childForm.addControl('name', new FormControl({ value: '', disabled: this.isDisabled }));
  }

  value(): CardListFilters {
    return this.childForm.getRawValue();
  }
}
