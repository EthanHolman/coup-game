import { GameEventType } from "../enums";
import { GameState } from "../GameState";
import { messageAllFn, ServerEvent } from "../types";

export function startGame(state: GameState, messageAllFn: messageAllFn) {
  if (state.players.length < 2)
    throw "at least 2 players must join before you can play";

  state.gameStatus = "RUNNING";
  state.currentPlayerId = 0;

  const event: ServerEvent = { event: GameEventType.START_GAME };

  messageAllFn(event);
}
