import { GameEventType } from "../enums";
import { GameState } from "../GameState";
import { messageAllFn, ServerEvent } from "../types";

export function resumeGame(
  state: GameState,
  messageAllFn: messageAllFn,
  reason: string = "game resumed"
) {
  if (state.gameStatus !== "PAUSED")
    throw "game cannot be resumed if it is not currently paused";

  const event: ServerEvent = {
    event: GameEventType.RESUME_GAME,
    data: { reason },
  };

  state.resume();
  messageAllFn(event);
}
