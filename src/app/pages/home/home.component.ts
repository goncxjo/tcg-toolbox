import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GameSelectorComponent } from "../../components/games/game-selector/game-selector.component";
import { UserService } from '../../core/services/user.service';
import { CardSearchService, ToolService } from '../../core';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { backgroundImage } from 'html2canvas/dist/types/css/property-descriptors/background-image';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, GameSelectorComponent, NgbCarouselModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  
  images = [
    'https://images2.imgbox.com/61/51/qOprgwL0_o.jpg',
    'https://images2.imgbox.com/50/f0/ZgxnaGQu_o.jpg',
    'https://images2.imgbox.com/fc/b4/1At1qU5M_o.jpg',
  ];
  randomIndex = Math.floor(Math.random() * this.images.length)

  constructor(
    private userService: UserService,
    private cardSearchService: CardSearchService,
    private toolService: ToolService
  ) { }

  getTools() {
    return this.toolService.getTools();
  }

  get randomImg() {
    return {
      backgroundImage: `linear-gradient(rgba(0, 0, 0, .5), rgba(0, 0, 0, .5)), url(${this.images[this.randomIndex]})`,
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }
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
