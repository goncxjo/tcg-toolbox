import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../../../backend/services/game.service';
import { Game } from '../../../backend';

@Component({
  selector: 'app-game-selector',
  standalone: true,
  imports: [],
  templateUrl: './game-selector.component.html',
  styleUrl: './game-selector.component.scss'
})
export class GameSelectorComponent {
  @Input() size: string = 'lg';

  constructor(
    private router: Router
  ) { }
  
  public games: Game[] = inject(GameService).getAll();

  setUrl(game: any = 'digimon') {
    return `assets/games/${game.id}.png`;
  }

  exploreGame(name: string) {
    this.router.navigate(['games', name]);
  }
}
