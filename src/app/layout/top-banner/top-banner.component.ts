import { Component, inject } from '@angular/core';
import { ToolService } from '../../core';
import { DolarComponent } from '../dolar/dolar.component';
import { ContentInfoComponent } from '../../shared/content-info/content-info.component';

@Component({
  selector: 'app-top-banner',
  imports: [DolarComponent, ContentInfoComponent],
  templateUrl: './top-banner.component.html',
  styleUrl: './top-banner.component.scss'
})
export class TopBannerComponent {
  private toolService = inject(ToolService)

  infoMsgPriceCalc: string = `<strong>RECORDATORIO: </strong>Los precios son obtenidos de TCGplayer y otras tiendas, los cuales no reflejan los precios reales de tu región. El uso de esta herramienta es única y exclusivamente para tener un punto de referencia a la hora de comerciar entre pares.`;



  get isPriceCalc() {
    return this.toolService.getSelectedToolPath() == 'price-calc';
  }
}
