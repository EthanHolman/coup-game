import { GameState } from "../GameState";

export function startGame(state: GameState) {
  if (state.players.length < 2)
    throw "at least 2 players must join before you can play";

  state.gameStarted = true;
  state.currentPlayerId = 0;
}
