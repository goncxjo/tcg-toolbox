import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { faWhatsapp, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { ReversePipe } from './reverse.pipe';
import { YesNoSelectComponent } from './select/yes-no-select/yes-no-select.component';
import { CurrencySelectComponent } from './select/currency-select/currency-select.component';
import { QrCodeComponent } from './qr-code/qr-code.component';
import { QRCodeModule } from 'angularx-qrcode';
import { ExpansionSelectComponent } from './select/expansion-select/expansion-select.component';
import { ColorMultiSelectComponent } from './select/color-multiselect/color-multiselect.component';
import { RarityMultiSelectComponent } from './select/rarity-multiselect/rarity-multiselect.component';
import { CategorySelectComponent } from './select/category-select/category-select.component';
import { ActionButtonComponent } from './ag-grid/action-button/action-button.component';

const MODULES = [
  CommonModule,
  NgbModule,
  FormsModule,
  ReactiveFormsModule,
  FontAwesomeModule,
  QRCodeModule
]

const PRIVATE_COMPONENTS: any = [
];

const PUBLIC_COMPONENTS: any = [
  ReversePipe,
  YesNoSelectComponent,
  CurrencySelectComponent,
  QrCodeComponent,
  ExpansionSelectComponent,
  ColorMultiSelectComponent,
  RarityMultiSelectComponent,
  CategorySelectComponent,
  ActionButtonComponent
];

@NgModule({
  declarations: [
    ...PRIVATE_COMPONENTS,
    ...PUBLIC_COMPONENTS,
    QrCodeComponent,
  ],
  imports: MODULES,
  exports: [
    MODULES,
    ...PUBLIC_COMPONENTS
  ],
  providers: [DatePipe]
})
export class SharedModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas, far);
    library.addIcons(faWhatsapp as IconDefinition);
    library.addIcons(faFacebook as IconDefinition);
  }

}
