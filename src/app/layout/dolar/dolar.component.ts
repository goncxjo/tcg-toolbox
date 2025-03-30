import { Component, OnInit, inject, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBan, faCheck, faPen, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Dolar, DolarService } from '../../backend';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import _ from 'lodash';
import { CurrencyPipe } from '@angular/common';
import { take } from 'rxjs';
import { DolarDataService } from '../../core/services/dolar.data.service';

@Component({
  selector: 'app-dolar',
  standalone: true,
  imports: [ReactiveFormsModule, FontAwesomeModule, CurrencyPipe],
  templateUrl: './dolar.component.html',
  styleUrl: './dolar.component.scss'
})
export class DolarComponent implements OnInit {
  loadingIcon = faSpinner;
  editIcon = faPen;
  banIcon = faBan;
  applyIcon = faCheck;
  
  editDolarMode: boolean = false;
  dolarVentaInput = new FormControl();
  
  dataService = inject(DolarDataService)

  ngOnInit(): void {
  }

  toggleEditDolarMode() {
    this.editDolarMode = !this.editDolarMode;
    if (!this.editDolarMode) this.dataService.getDolar();
  }

  updateDolarVenta() {
    const newDolar = _.clone(this.dataService.dolar());
    if (newDolar) {
      newDolar.venta = this.dolarVentaInput.value;
      this.dataService.update(newDolar);
    }
  }
}
