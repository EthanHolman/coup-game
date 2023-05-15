import { GameState } from "../GameState";
import { messageAllFn } from "../messageFnTypes";
import { nextTurn } from "../actions/nextTurn";
import { GameEvent } from "../../../shared/GameEvent";

export function acceptBlock(
  state: GameState,
  gameEvent: GameEvent,
  messageAllFn: messageAllFn
) {
  if (!state.blockAction) throw "There isn't a block action currently in play";

  if (gameEvent.user !== state.currentPlayer.name)
    throw "Only current player can accept the block";

  messageAllFn(gameEvent);
  nextTurn(state);
}
