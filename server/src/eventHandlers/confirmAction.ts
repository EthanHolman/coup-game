import { dispatchPlayerLoseCard } from "../actions/dispatchPlayerLoseCard";
import {
  GameActionMove,
  GameStatus,
  NON_TARGETED_ACTIONS,
  TARGETED_ACTIONS,
} from "../../../shared/enums";
import { GameState } from "../GameState";
import { messageAllFn } from "../messageFnTypes";
import { nextTurn } from "../actions/nextTurn";
import { GameEvent } from "../../../shared/GameEvent";

export function confirmAction(
  state: GameState,
  gameEvent: GameEvent,
  messageAllFn: messageAllFn,
  autoConfirm?: boolean // bypass player validation and event messaging to all users
) {
  if (state.status !== GameStatus.ACTION_SELECTED)
    throw "confirmAction only valid when status = ACTION_SELECTED";

  if (!autoConfirm) {
    messageAllFn(gameEvent);

    if (
      TARGETED_ACTIONS.includes(state.currentAction?.action!) &&
      gameEvent.user !== state.currentAction?.targetPlayer
    )
      throw `Wrong user, only ${state.currentAction?.targetPlayer} can confirm ${state.currentAction?.action}!`;

    if (
      NON_TARGETED_ACTIONS.includes(state.currentAction?.action!) &&
      gameEvent.user !== state.currentPlayer.name
    )
      throw `Wrong user, only ${state.currentPlayer.name} can confirm ${state.currentAction?.action}!`;
  }

  switch (state.currentAction?.action) {
    case GameActionMove.ASSASSINATE:
    case GameActionMove.COUP:
      dispatchPlayerLoseCard(
        state,
        state.currentAction?.targetPlayer!,
        `You were ${
          state.currentAction.action === GameActionMove.ASSASSINATE
            ? "assassinated"
            : "couped"
        }`,
        messageAllFn
      );
      state.clearCurrentAction();
      break;

    case GameActionMove.EXCHANGE:
      break;

    case GameActionMove.FOREIGN_AID:
      state.currentPlayer.updateCoins(2);
      break;

    case GameActionMove.INCOME:
      state.currentPlayer.updateCoins(1);
      break;

    case GameActionMove.STEAL:
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
      state.currentPlayer.updateCoins(3);
      break;

    default:
      throw `cannot process unexpected action ${state.currentAction?.action}`;
  }

  // trigger next turn if action is complete at this point in the execution
  //  i.e., we're not waiting for an exchange or player to lose a card
  if (
    [
      GameActionMove.FOREIGN_AID,
      GameActionMove.INCOME,
      GameActionMove.STEAL,
      GameActionMove.TAX,
    ].includes(state.currentAction?.action)
  )
    nextTurn(state, messageAllFn);
}
