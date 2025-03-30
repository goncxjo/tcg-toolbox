import { inject } from "@angular/core";
import { CanActivateFn } from "@angular/router";
import { GameService } from "../../backend/services/game.service";

export const isGameValidGuard: CanActivateFn =  (route, state) => {
    const games = inject(GameService).getAll();
    const path = route.params['game'];
    return path == '' || games.some(game => game.id === route.params['game']);
  };
