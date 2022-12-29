import { GameEventType } from "../enums";
import { GameState } from "../GameState";
import { messageAllFn, ServerEvent } from "../types";

export function pauseGame(
  state: GameState,
  messageAllFn: messageAllFn,
  reason: string = "game paused"
) {
  if (state.gameStatus === "PRE_GAME")
    throw "cannot pause game during pre-game";

  const event: ServerEvent = {
    event: GameEventType.PAUSE_GAME,
    data: { reason },
  };

  state.pause();
  messageAllFn(event);
}
