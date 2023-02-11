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

  if (state.players.length > 1 && player.isHost) {
    player.isHost = false;
    const newHost = state.players.filter((x) => x.name !== player.name)[0];
    newHost.isHost = true;
  }

  if (state.gameStatus === "PRE_GAME") {
    player.cards.forEach((x) => state.deck.discardCard(x.card));
    state.removePlayer(player.name);
    messageAllFn(gameEvent);
  } else {
    player.isConnected = false;
    pauseGame(state, messageAllFn, `player ${gameEvent.user} disconnected`);
  }
}
