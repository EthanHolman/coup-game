import { GameState } from "../GameState";
import { GameEvent } from "../types";
import { messageAllFn } from "../types";

export function chooseAction(
  state: GameState,
  gameEvent: GameEvent,
  messageAllFn: messageAllFn
) {
  // might want to validate incoming action
  state.activeAction = gameEvent.data.action;
  messageAllFn(gameEvent);
}
