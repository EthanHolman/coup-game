import { GameState } from "../GameState";
import { GameEvent, messageAllFn } from "../types";

export function resumeGame(
  gameState: GameState,
  gameEvent: GameEvent,
  messageAllFn: messageAllFn
) {
  if (gameState.gameStatus !== "PAUSED")
    throw "game cannot be resumed if it is not currently paused";

  gameState.resume();
  messageAllFn(gameEvent);
}
