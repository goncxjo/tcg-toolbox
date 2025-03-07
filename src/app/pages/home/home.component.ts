import { Component } from '@angular/core';
import { LogoComponent } from '../../layout/logo/logo.component';
import { RouterLink } from '@angular/router';
import { ContentInfoComponent } from '../../shared/content-info/content-info.component';
import { GameSelectorComponent } from "../../components/games/game-selector/game-selector.component";
import { UserService } from '../../core/services/user.service';
import { CardSearchService, ToolService } from '../../core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [LogoComponent, RouterLink, ContentInfoComponent, GameSelectorComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  infoMsg: string = `Los precios son obtenidos de TCGplayer y otras tiendas. Estos no reflejan los precios reales del mercado de cada país. El uso de esta aplicación es única y exclusivamente para tener un punto de referencia a la hora de comerciar entre pares.`;

  constructor(
    private userService: UserService,
    private cardSearchService: CardSearchService,
    private toolService: ToolService
  ) { }

  getTools() {
    return this.toolService.getTools();
  }

  login() {
    this.userService.loginWithGoogle();
  }

  logout() {
    this.userService.logout();
  }

  isLoggedIn() {
    return this.userService.isLoggedIn();
  }

  openCardSearchModal() {
    this.cardSearchService.openCardSearchModal();
  }
}
