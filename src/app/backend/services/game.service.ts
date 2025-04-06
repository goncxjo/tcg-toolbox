import { Injectable } from '@angular/core';
import { Game } from '../models';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor() { }

  getAll(): Game[] {
    return [
      { id: 'digimon', name: 'Digimon Card Game', isAvailable: true, disabled: false },
      { id: 'one-piece', name: 'One Piece Card Game', isAvailable: true, disabled: false },
      { id: 'yu-gi-oh', name: 'Yu Gi Oh!', isAvailable: true, disabled: false },
      { id: 'magic', name: 'Magic: The Gathering', isAvailable: true, disabled: false },
      { id: 'pokemon', name: 'Pokémon', isAvailable: true, disabled: false },
      { id: 'dragon-ball-super', name: 'Dragon Ball Super', isAvailable: false, disabled: true },
    ];
  }
}
