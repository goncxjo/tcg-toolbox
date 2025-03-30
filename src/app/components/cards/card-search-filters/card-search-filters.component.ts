import { Component, Input } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ControlContainer, FormControl, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { ExpansionSelectComponent } from '../../../shared/select/expansion-select/expansion-select.component';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { GameSelectComponent } from '../../games/game-select/game-select.component';
import { Game } from '../../../backend';

@Component({
  selector: 'app-card-search-filters',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FontAwesomeModule,
    ExpansionSelectComponent,
    GameSelectComponent
  ],
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

  gameSelected!: Game;
  @Input() isDisabled: boolean = false;
  
  constructor(
    public parentForm: FormGroupDirective,
  ) { }

  ngAfterContentInit(): void {
    this.childForm = this.parentForm.form;
    this.childForm.addControl('game', new FormControl({ value: '', disabled: this.isDisabled }));
    this.childForm.addControl('expansion', new FormControl({ value: '', disabled: this.isDisabled }));
  }

  onGameChanged($event: any) {
    // this.gameSelected = $event.target;
  }    
}
