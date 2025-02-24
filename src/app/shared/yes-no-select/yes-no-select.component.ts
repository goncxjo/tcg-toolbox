import { AfterContentInit, Component, Input } from '@angular/core';
import { ReactiveFormsModule, ControlContainer, FormGroupDirective, FormControl } from '@angular/forms';

@Component({
  selector: 'app-yes-no-select',
  templateUrl: './yes-no-select.component.html',
  styleUrls: ['./yes-no-select.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ]
})
export class YesNoSelectComponent implements AfterContentInit {
  childForm: any;

  @Input() isDisabled: boolean = false;
  @Input() showOptionAll: boolean = false;
  @Input() name: string = 'yes-no';
  @Input() innerLabel: string = "";

  constructor(
    public parentForm: FormGroupDirective
  ) { }

  ngAfterContentInit(): void {
    this.childForm = this.parentForm.form;
    this.childForm.addControl(this.name, new FormControl({value: '', disabled: this.isDisabled}));
  }
}