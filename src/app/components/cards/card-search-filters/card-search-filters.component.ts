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

  gameLocked: boolean = false;
  @Input() isDisabled: boolean = false;
  
  constructor(
    public parentForm: FormGroupDirective,
  ) { }

  ngAfterContentInit(): void {
    this.childForm = this.parentForm.form;
    this.childForm.addControl('game', new FormControl({ value: '', disabled: this.isDisabled }));
    this.childForm.addControl('gameLocked', new FormControl({ value: '', disabled: this.isDisabled }));
    this.childForm.addControl('expansion', new FormControl({ value: '', disabled: this.isDisabled }));

    setTimeout(() => {
      const gameSelected = localStorage.getItem('game');
      this.gameLocked = !!gameSelected;
      if (this.gameLocked) {
        this.childForm.get('game')?.setValue(gameSelected);
        this.childForm.get('gameLocked')?.setValue(this.gameLocked);
        this.gameCtrl.disable();
      }
    }, 200);
  }

  get gameCtrl(): FormControl {
    return this.childForm.controls['game'] as FormControl;
  }

  onGameLockedChanged($event: any) {
    this.gameLocked = $event.target.checked;
    if (this.gameLocked) {
      localStorage.setItem('game', this.childForm.get('game')?.value);
      this.gameCtrl.disable();
    } else {
      localStorage.removeItem('game');
      this.gameCtrl.enable();
    }
  }
}
