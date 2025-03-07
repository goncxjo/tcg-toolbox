import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GameSelectorComponent } from "../../components/games/game-selector/game-selector.component";
import { UserService } from '../../core/services/user.service';
import { CardSearchService, ToolService } from '../../core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, GameSelectorComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
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
