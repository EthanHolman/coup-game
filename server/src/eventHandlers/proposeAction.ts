import { GameState } from "../GameState";
import { GameEvent } from "../types";
import { messageAllFn } from "../types";

export function proposeAction(
  state: GameState,
  gameEvent: GameEvent,
  messageAllFn: messageAllFn
) {
  state.activeAction = gameEvent.data.action;
  messageAllFn(gameEvent);
}
