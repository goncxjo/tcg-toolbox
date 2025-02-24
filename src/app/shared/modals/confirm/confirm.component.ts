
import { Component, inject, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm',
  standalone: true,
  imports: [],
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.scss'
})
export class ConfirmComponent {
  @Input() title: string = 'Confirmación';
  @Input() message: string = '¿Estás seguro que querés continuar?';

  modal = inject(NgbActiveModal);
}