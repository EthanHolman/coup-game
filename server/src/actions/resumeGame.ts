import { GameEventType } from "../../../shared/enums";
import { createServerEvent } from "../utils/createServerEvent";
import { GameState } from "../GameState";
import { messageAllFn } from "../messageFnTypes";

export function resumeGame(
  state: GameState,
  messageAllFn: messageAllFn,
  reason: string = "game resumed"
) {
  if (!state.isPaused)
    throw "game cannot be resumed if it is not currently paused";

  const event = createServerEvent(GameEventType.RESUME_GAME, { reason });

  state.resume();
  messageAllFn(state.gameCode, event);
}
