import { pauseGame } from "../actions/pauseGame";
import { GameState } from "../GameState";
import { messageAllFn } from "../messageFnTypes";
import { GameEvent } from "../../../shared/GameEvent";

export function playerDisconnect(
  state: GameState,
  gameEvent: GameEvent,
  messageAllFn: messageAllFn
) {
  const player = state.players.find((x) => x.name === gameEvent.user);
  if (!player) throw `unable to find player ${player} in gamestate`;

  if (state.gameStatus === "PRE_GAME") {
    player.cards.forEach((x) => state.deck.discardCard(x.card));
    state.removePlayer(player.name);
    messageAllFn(gameEvent);
  } else {
    player.isConnected = false;
    pauseGame(state, messageAllFn, `player ${gameEvent.user} disconnected`);
  }
}
