import { dispatchPlayerLoseCard } from "../actions/dispatchPlayerLoseCard";
import { GameActionMove } from "../enums";
import { GameState } from "../GameState";
import { GameEvent, messageAllFn, messagePlayerFn } from "../types";
import { nextTurn } from "../actions/nextTurn";

export function confirmAction(
  state: GameState,
  gameEvent: GameEvent,
  messageAllFn: messageAllFn,
  messagePlayerFn: messagePlayerFn
) {
  // event validations
  if (gameEvent.user !== state.currentPlayer.name) throw "wrong user!";

  // broadcast confirmation to all players
  messageAllFn(gameEvent);

  switch (state.currentAction?.action) {
    case GameActionMove.ASSASSINATE:
      dispatchPlayerLoseCard(
        state,
        state.currentAction!.targetPlayer!,
        GameActionMove.ASSASSINATE,
        messagePlayerFn
      );
      break;

    case GameActionMove.COUP:
      dispatchPlayerLoseCard(
        state,
        state.currentAction!.targetPlayer!,
        GameActionMove.COUP,
        messagePlayerFn
      );
      break;

    case GameActionMove.EXCHANGE:
      break;

    case GameActionMove.FOREIGN_AID:
      break;

    case GameActionMove.INCOME:
      const player = state.players.find((x) => x.name === gameEvent.user);
      if (!player) throw `unable to find player ${gameEvent.user}`;
      player.coins += 1;
      break;

    case GameActionMove.STEAL:
      state.currentPlayer.coins += 2;
      break;

    case GameActionMove.TAX:
      state.currentPlayer.coins += 3;
      break;

    default:
      throw `cannot process unexpected action ${state.currentAction?.action}`;
  }

  nextTurn(state);
}
