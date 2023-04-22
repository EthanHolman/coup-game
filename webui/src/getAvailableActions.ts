import { GameActionMove, GameEventType } from "../../shared/enums";
import { ClientState } from "./ClientState";

export type ClientGameAction = GameEventType | GameActionMove;

export function getAvailableActions(state: ClientState): ClientGameAction[] {
  let actions: ClientGameAction[] = [];

  if (state.gameStatus !== "RUNNING") return [];

  if (!state.currentAction && !state.blockAction && state.isMyTurn) {
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

  if (state.currentAction && !state.blockAction && !state.isMyTurn) {
    const blockableActions = [
      GameActionMove.ASSASSINATE,
      GameActionMove.FOREIGN_AID,
      GameActionMove.STEAL,
    ];
    if (blockableActions.includes(state.currentAction.action!))
      actions.push(GameEventType.BLOCK_ACTION);

    const challengeableActions = [
      GameActionMove.ASSASSINATE,
      GameActionMove.EXCHANGE,
      GameActionMove.STEAL,
      GameActionMove.TAX,
    ];
    if (challengeableActions.includes(state.currentAction.action!))
      actions.push(GameEventType.CHALLENGE_ACTION);

    if (state.currentAction.targetPlayer === state.thisPlayer.name)
      actions.push(GameEventType.CONFIRM_ACTION);
  }

  if (state.blockAction) {
    // current player can accept a block
    if (state.currentPlayerName === state.thisPlayer.name) {
      actions.push(GameEventType.ACCEPT_BLOCK);
    }

    // everyone except blocker can challenge a block
    if (state.blockAction.user !== state.thisPlayer.name)
      actions.push(GameEventType.CHALLENGE_BLOCK);
  }

  return actions;
}
