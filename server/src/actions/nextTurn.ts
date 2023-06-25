import { GameEventType } from "../../../shared/enums";
import { GameState } from "../GameState";
import { messageAllFn } from "../messageFnTypes";
import { createServerEvent } from "../utils/createServerEvent";

export function nextTurn(state: GameState, messageAllFn: messageAllFn) {
  let nextPlayerId = state.currentPlayerId;
  do {
    nextPlayerId = (nextPlayerId + 1) % state.players.length;
  } while (state.players[nextPlayerId] && state.players[nextPlayerId].isOut);

  state.currentPlayerId = nextPlayerId;
  state.playerLosingCard = undefined;
  state.currentAction = undefined;
  state.blockAction = undefined;

  messageAllFn(
    createServerEvent(GameEventType.NEXT_TURN, {
      name: state.currentPlayer.name,
    })
  );
}
