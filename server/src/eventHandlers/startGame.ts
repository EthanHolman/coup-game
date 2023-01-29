import { GameEventType } from "../../../shared/enums";
import { createServerEvent } from "../utils/createServerEvent";
import { GameState } from "../GameState";
import { messageAllFn } from "../messageFnTypes";

export function startGame(state: GameState, messageAllFn: messageAllFn) {
  if (state.players.length < 2)
    throw "at least 2 players must join before you can play";

  state.start();
  state.currentPlayerId = 0;

  const event = createServerEvent(GameEventType.START_GAME);

  messageAllFn(event);
}
