import { resumeGame } from "../actions/resumeGame";
import { GameEvent } from "../../../shared/GameEvent";
import { GameState } from "../GameState";
import { messageAllFn } from "../messageFnTypes";
import { GameStatus } from "../../../shared/enums";
import { addNewPlayer } from "../actions/addNewPlayer";
import { SERVER_USERNAME, USERNAME_REGEX } from "../../../shared/globals";

export function playerJoinGame(
  state: GameState,
  gameEvent: GameEvent,
  messageAllFn: messageAllFn
) {
  if (state.getStatus() === GameStatus.PRE_GAME) {
    if (
      gameEvent.user === SERVER_USERNAME ||
      !USERNAME_REGEX.test(gameEvent.user)
    )
      throw "invalid username";

    addNewPlayer(state, gameEvent.user);

    messageAllFn(state.gameCode, gameEvent);
    return;
  }

  // allow disconnected players to reconnect
  const player = state.players.find(
    (x) => x.name === gameEvent.user && !x.isConnected
  );
  if (player) {
    player.isConnected = true;

    // if everyone is re-connected, restart the game
    if (
      !state.players.map((x) => x.isConnected).includes(false) &&
      state.getStatus() !== GameStatus.GAME_OVER
    )
      resumeGame(state, messageAllFn, "all players have reconnected!");

    return;
  }

  throw `game has already started.`;
}
