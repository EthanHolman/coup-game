import {
  BLOCKABLE_ACTIONS,
  CHALLENGEABLE_ACTIONS,
  GameActionMove,
  GameEventType,
  GameStatus,
  NON_TARGETED_ACTIONS,
} from "../../shared/enums";
import { ClientState } from "./ClientState";

export type ClientGameAction = GameEventType | GameActionMove;

export function getAvailableActions(state: ClientState): ClientGameAction[] {
  let actions: ClientGameAction[] = [];

  if (state.isPaused || state.status === GameStatus.PRE_GAME) return [];

  if (state.status === GameStatus.PLAYER_LOSING_CARD) {
  }

  if (state.isMyTurn && !state.currentAction && !state.blockAction) {
    if (state.thisPlayer.coins >= 10) {
      actions = [GameActionMove.COUP];
    } else {
      actions = [
        GameActionMove.EXCHANGE,
        GameActionMove.FOREIGN_AID,
        GameActionMove.INCOME,
        GameActionMove.STEAL,
        GameActionMove.TAX,
      ];
      if (state.thisPlayer.coins >= 3) actions.push(GameActionMove.ASSASSINATE);
      if (state.thisPlayer.coins >= 7) actions.push(GameActionMove.COUP);
    }
  }

  if (
    state.isMyTurn &&
    state.currentAction &&
    NON_TARGETED_ACTIONS.includes(state.currentAction.action!) &&
    !state.blockAction
  )
    actions.push(GameEventType.CONFIRM_ACTION);

  if (!state.isMyTurn && state.currentAction && !state.blockAction) {
    if (BLOCKABLE_ACTIONS.includes(state.currentAction.action!))
      actions.push(GameEventType.BLOCK_ACTION);

    if (CHALLENGEABLE_ACTIONS.includes(state.currentAction.action!))
      actions.push(GameEventType.CHALLENGE_ACTION);

    if (state.currentAction.targetPlayer === state.thisPlayer.name)
      actions.push(GameEventType.CONFIRM_ACTION);
  }

  if (state.blockAction) {
    // current player can accept a block
    if (state.isMyTurn) {
      actions.push(GameEventType.ACCEPT_BLOCK);
    }

    // everyone except blocker can challenge a block
    if (state.blockAction.user !== state.thisPlayer.name)
      actions.push(GameEventType.CHALLENGE_BLOCK);
  }

  return actions;
}
