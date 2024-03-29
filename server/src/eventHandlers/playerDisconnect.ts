import { pauseGame } from "../actions/pauseGame";
import { GameState } from "../GameState";
import { messageAllFn } from "../messageFnTypes";
import { GameEvent } from "../../../shared/GameEvent";
import { GameStatus } from "../../../shared/enums";

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

  const gameStatus = state.getStatus();

  if (gameStatus === GameStatus.PRE_GAME) {
    player.cards.forEach((x) => state.deck.discardCard(x.card));
    state.removePlayer(player.name);
    messageAllFn(state.gameCode, gameEvent);
  } else {
    player.isConnected = false;
    if (gameStatus !== GameStatus.GAME_OVER) {
      pauseGame(state, messageAllFn, `player ${gameEvent.user} disconnected`);
    }
  }
}
