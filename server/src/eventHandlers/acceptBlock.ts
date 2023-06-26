import { GameState } from "../GameState";
import { messageAllFn } from "../messageFnTypes";
import { nextTurn } from "../actions/nextTurn";
import { GameEvent } from "../../../shared/GameEvent";
import { GameStatus } from "../../../shared/enums";

export function acceptBlock(
  state: GameState,
  gameEvent: GameEvent,
  messageAllFn: messageAllFn
) {
  if (state.getStatus() !== GameStatus.ACTION_BLOCKED)
    throw "accept block is only valid when status = ACTION_BLOCKED";

  if (gameEvent.user !== state.currentPlayer.name)
    throw "Only current player can accept the block";

  messageAllFn(gameEvent);

  nextTurn(state, messageAllFn);
}
