import { GameState } from "../GameState";
import { GameEvent, messageAllFn } from "../types";
import { nextTurn } from "./nextTurn";

export function acceptBlock(
  state: GameState,
  gameEvent: GameEvent,
  messageAllFn: messageAllFn
) {
  messageAllFn(gameEvent);
  nextTurn(state);
}
