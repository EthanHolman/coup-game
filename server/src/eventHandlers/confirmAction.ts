import { dispatchPlayerLoseCard } from "../actions/dispatchPlayerLoseCard";
import { GameActionMove, GameStatus } from "../../../shared/enums";
import { GameState } from "../GameState";
import { messageAllFn, messagePlayerFn } from "../messageFnTypes";
import { nextTurn } from "../actions/nextTurn";
import { GameEvent } from "../../../shared/GameEvent";

export function confirmAction(
  state: GameState,
  gameEvent: GameEvent,
  messageAllFn: messageAllFn,
  messagePlayerFn: messagePlayerFn
) {
  if (state.status !== GameStatus.ACTION_SELECTED)
    throw "confirmAction only valid when status = ACTION_SELECTED";

  // income is auto-confirmed, so we don't want to double notify the users
  if (state.currentAction?.action !== GameActionMove.INCOME)
    messageAllFn(gameEvent);

  switch (state.currentAction?.action) {
    case GameActionMove.ASSASSINATE:
    case GameActionMove.COUP:
      if (gameEvent.user !== state.currentAction.targetPlayer)
        throw `Wrong user, only ${state.currentAction.targetPlayer} can confirm ${state.currentAction.action}!`;

      dispatchPlayerLoseCard(
        state,
        state.currentAction.targetPlayer,
        messagePlayerFn,
        `You were ${
          state.currentAction.action === GameActionMove.ASSASSINATE
            ? "assassinated"
            : "couped"
        }`
      );
      state.clearCurrentAction();
      break;

    case GameActionMove.EXCHANGE:
      break;

    case GameActionMove.FOREIGN_AID:
      if (gameEvent.user !== state.currentPlayer.name)
        throw `Wrong user, only ${state.currentPlayer.name} can confirm foreign aid!`;

      state.currentPlayer.updateCoins(2);
      break;

    case GameActionMove.INCOME:
      if (gameEvent.user !== state.currentPlayer.name)
        throw `Wrong user, only ${state.currentPlayer.name} can confirm income!`;

      state.currentPlayer.updateCoins(1);
      break;

    case GameActionMove.STEAL:
      if (gameEvent.user !== state.currentAction.targetPlayer)
        throw `Wrong user, only ${state.currentAction.targetPlayer} can confirm stealing!`;

      const targetPlayer = state.players.find(
        (x) => x.name === state.currentAction?.targetPlayer
      );
      if (!targetPlayer)
        throw `could not find targetPlayer ${state.currentAction.targetPlayer} to steal from!`;

      const targetOriginalCoins = targetPlayer.coins;
      targetPlayer.updateCoins(-2);
      const numCoinsStolen = targetOriginalCoins - targetPlayer.coins;
      state.currentPlayer.updateCoins(numCoinsStolen);
      break;

    case GameActionMove.TAX:
      if (gameEvent.user !== state.currentPlayer.name)
        throw `Wrong user, only ${state.currentPlayer.name} can confirm tax!`;

      state.currentPlayer.updateCoins(3);
      break;

    default:
      throw `cannot process unexpected action ${state.currentAction?.action}`;
  }

  nextTurn(state);
}
