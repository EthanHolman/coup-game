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
  if (gameEvent.user !== state.currentPlayer.name) throw "wrong user!";

  messageAllFn(gameEvent);

  switch (state.currentAction?.action) {
    case GameActionMove.ASSASSINATE:
    case GameActionMove.COUP:
      dispatchPlayerLoseCard(
        state,
        state.currentAction!.targetPlayer!,
        state.currentAction.action,
        messagePlayerFn
      );
      state.clearCurrentAction();
      break;

    case GameActionMove.EXCHANGE:
      break;

    case GameActionMove.FOREIGN_AID:
      state.currentPlayer.coins += 2;
      break;

    case GameActionMove.INCOME:
      state.currentPlayer.coins += 1;
      break;

    case GameActionMove.STEAL:
      const targetPlayer = state.players.find(
        (x) => x.name === state.currentAction?.targetPlayer
      );
      if (!targetPlayer)
        throw `could not find targetPlayer ${state.currentAction.targetPlayer} to steal from!`;
      const targetOriginalCoins = targetPlayer.coins;
      targetPlayer.coins - 2;
      if (targetPlayer.coins < 0) targetPlayer.coins = 0;
      const numCoinsStolen = targetOriginalCoins - targetPlayer.coins;
      state.currentPlayer.coins += numCoinsStolen;
      break;

    case GameActionMove.TAX:
      state.currentPlayer.coins += 3;
      break;

    default:
      throw `cannot process unexpected action ${state.currentAction?.action}`;
  }

  nextTurn(state);
}
