import { Component } from '@angular/core';
import { LogoComponent } from '../../layout/logo/logo.component';
import { RouterLink } from '@angular/router';
import { ContentInfoComponent } from '../../shared/content-info/content-info.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [LogoComponent, RouterLink, ContentInfoComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  infoMsg: string = `Los precios obtenidos de TCGplayer no reflejan los precios reales del mercado de cada país. El uso de esta aplicación es única y exclusivamente para tener un punto de referencia.`;
}
