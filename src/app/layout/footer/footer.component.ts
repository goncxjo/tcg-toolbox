import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true
})
export class FooterComponent {
  // actualYear: number = (new Date()).getFullYear();
 
  getFooterText() {
    return `Desarrollado por: @goncxjo`
  }

}
