import { GameState, GameStatus } from "../GameState";
import { messageAllFn } from "../messageFnTypes";
import { nextTurn } from "../actions/nextTurn";
import { GameEvent } from "../../../shared/GameEvent";

export function acceptBlock(
  state: GameState,
  gameEvent: GameEvent,
  messageAllFn: messageAllFn
) {
  if (state.status !== GameStatus.ACTION_BLOCKED)
    throw "accept block is only valid when status = ACTION_BLOCKED";

  if (gameEvent.user !== state.currentPlayer.name)
    throw "Only current player can accept the block";

  messageAllFn(gameEvent);
  nextTurn(state);
}
