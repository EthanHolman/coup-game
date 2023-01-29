import { GameState } from "../GameState";
import { messageAllFn } from "../messageFnTypes";
import { nextTurn } from "../actions/nextTurn";
import { GameEvent } from "../../../shared/GameEvent";

export function acceptBlock(
  state: GameState,
  gameEvent: GameEvent,
  messageAllFn: messageAllFn
) {
  messageAllFn(gameEvent);
  nextTurn(state);
}
