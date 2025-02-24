import { DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { registerLocaleData } from '@angular/common';
import localeEn from '@angular/common/locales/en';
import localeEs from '@angular/common/locales/es';
import localeEsAr from '@angular/common/locales/es-AR';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { SharedModule } from './shared/shared.module';
import { LayoutModule } from './layout/layout.module';
import { AppConfigModule } from './core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CardInfoComponent } from './cards/card-info/card-info.component';
import { ToastrModule } from 'ngx-toastr';
import { CardSearcherComponent } from './cards/card-searcher/card-searcher.component';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { ComoFuncionaComponent } from './como-funciona/como-funciona.component';
import { HttpErrorInterceptor, LoaderInterceptor } from './backend/interceptors';
import { ExportImgComponent } from './cards/modals/export-img/export-img.component';

registerLocaleData(localeEs, 'es');
registerLocaleData(localeEn, 'en')
registerLocaleData(localeEsAr, 'es-Ar');

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CardInfoComponent,
    CardSearcherComponent,
    ComoFuncionaComponent,
    ExportImgComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    AppConfigModule,
    LayoutModule,
    SharedModule,
    FontAwesomeModule,
    ToastrModule.forRoot(),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    { provide: DEFAULT_CURRENCY_CODE, useValue: '' },
    { provide: LOCALE_ID, useValue: 'Es-Ar' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas, far);
    library.addIcons(faWhatsapp as IconDefinition);
  }
}
