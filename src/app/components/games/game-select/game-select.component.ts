import { Component, Input, AfterContentInit } from '@angular/core';
import { FormControl, FormGroupDirective, ControlContainer, ReactiveFormsModule } from '@angular/forms';
import * as _ from 'lodash';
import { Observable, map, of } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { GameService } from '../../../backend/services/game.service';

@Component({
  selector: 'app-game-select',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './game-select.component.html',
  styleUrl: './game-select.component.scss',
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ]
})
export class GameSelectComponent implements AfterContentInit {
  data$!: Observable<any[]>;

  chlidForm: any;

  @Input() isDisabled: boolean = false;
  @Input() showOptionAll: boolean = false;
  @Input() showOnlyAvailable: boolean = false;
  @Input() name: string = '';

  constructor(
    private gameService: GameService,
    public parentForm: FormGroupDirective
  ) { }

  ngOnInit() {
    let res = this.gameService.getAll();
    if(this.showOnlyAvailable) {
      res = _.filter(res, (g) => !g.disabled)
    }
    this.data$ = of(res);
  }
  
  ngAfterContentInit(): void {
    this.chlidForm = this.parentForm.form;
    this.chlidForm.addControl(this.name, new FormControl({value: '', disabled: this.isDisabled}));
  }
}
