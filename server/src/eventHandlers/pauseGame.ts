import { GameState } from "../GameState";
import { GameEvent, messageAllFn } from "../types";

export function pauseGame(
  gameState: GameState,
  gameEvent: GameEvent,
  messageAllFn: messageAllFn
) {
  if (gameState.gameStatus === "PRE_GAME")
    throw "cannot pause game during pre-game";

  gameState.pause();
  messageAllFn(gameEvent);
}
