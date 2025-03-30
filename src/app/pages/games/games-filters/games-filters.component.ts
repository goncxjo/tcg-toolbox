import { Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ControlContainer, FormControl, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { CategorySelectComponent } from '../../../shared/select/category-select/category-select.component';
import { ColorMultiSelectComponent } from '../../../shared/select/color-multiselect/color-multiselect.component';
import { ExpansionSelectComponent } from '../../../shared/select/expansion-select/expansion-select.component';
import { RarityMultiSelectComponent } from '../../../shared/select/rarity-multiselect/rarity-multiselect.component';
import { GameSelectComponent } from '../../../components/games/game-select/game-select.component';
import { YesNoSelectComponent } from '../../../shared/select/yes-no-select/yes-no-select.component';

@Component({
  selector: 'app-games-filters',
  standalone: true,
  imports: [ReactiveFormsModule, FontAwesomeModule, RarityMultiSelectComponent, ColorMultiSelectComponent, CategorySelectComponent, ExpansionSelectComponent, GameSelectComponent, YesNoSelectComponent],
  templateUrl: './games-filters.component.html',
  styleUrl: './games-filters.component.scss',
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class GamesFiltersComponent {
  childForm: any;

  @Input() isDisabled: boolean = false;
  
  constructor(
    public parentForm: FormGroupDirective,
  ) { }

  ngAfterContentInit(): void {
    this.childForm = this.parentForm.form;
    this.childForm.addControl('expansion', new FormControl({ value: '', disabled: this.isDisabled }));
    this.childForm.addControl('showPreRelease', new FormControl({ value: false, disabled: this.isDisabled }));
  }

  value(): any {
    return this.childForm.getRawValue();
  }
}
