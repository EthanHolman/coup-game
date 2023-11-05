import { GameEventType, GameStatus } from "../../../shared/enums";
import { GameState } from "../GameState";
import { messageAllFn } from "../messageFnTypes";
import { createServerEvent } from "../utils/createServerEvent";

export function nextTurn(state: GameState, messageAllFn: messageAllFn) {
  if (state.getStatus() === GameStatus.GAME_OVER) {
    const lastRemainingPlayer = state.players.find((x) => !x.isOut);
    if (!lastRemainingPlayer) throw "unable to find the last remaining player";
    messageAllFn(
      state.gameCode,
      createServerEvent(GameEventType.GAME_OVER, {
        name: lastRemainingPlayer.name,
      })
    );
    return;
  }

  let nextPlayerId = state.currentPlayerId;
  do {
    nextPlayerId = (nextPlayerId + 1) % state.players.length;
  } while (state.players[nextPlayerId] && state.players[nextPlayerId].isOut);

  state.currentPlayerId = nextPlayerId;
  state.playerLosingCard = undefined;
  state.currentAction = undefined;
  state.blockAction = undefined;

  messageAllFn(
    state.gameCode,
    createServerEvent(GameEventType.NEXT_TURN, {
      name: state.currentPlayer.name,
    })
  );
}
