import { NgModule } from '@angular/core';

import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';

const PRIVATE_COMPONENTS: any = [
];

const PUBLIC_COMPONENTS = [
  NavbarComponent,
  FooterComponent
];

@NgModule({
  declarations: [
    ...PRIVATE_COMPONENTS,
    ...PUBLIC_COMPONENTS,
  ],
  imports: [
    RouterModule,
    CommonModule,
    SharedModule
  ],
  exports: [
    ...PUBLIC_COMPONENTS
  ],
  providers: []
})
export class LayoutModule { }
