import { GameEventType, GameStatus } from "../../../shared/enums";
import { createServerEvent } from "../utils/createServerEvent";
import { GameState } from "../GameState";
import { messageAllFn } from "../messageFnTypes";

export function pauseGame(
  state: GameState,
  messageAllFn: messageAllFn,
  reason: string = "game paused"
) {
  if (state.status === GameStatus.PRE_GAME)
    throw "cannot pause game during pre-game";

  const event = createServerEvent(GameEventType.PAUSE_GAME, { reason });

  state.pause();
  messageAllFn(event);
}
