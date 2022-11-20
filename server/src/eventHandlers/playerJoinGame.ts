import { GameState } from "../GameState";
import { Player } from "../Player";
import { GameEvent } from "../types";

export function playerJoinGame(state: GameState, gameEvent: GameEvent) {
  if (
    !state.gameStarted &&
    !state.players.map((x) => x.name).includes(gameEvent.user)
  ) {
    const newPlayerCards = state.deck.drawCard(2);
    const newPlayer = new Player(gameEvent.user, newPlayerCards);
    state.players.push(newPlayer);
  }
}
