import { GameActionMove } from "../../shared/enums";
import { ClientGameAction } from "./ClientGameAction";
import { ClientState } from "./ClientState";

export function getAvailableActions(state: ClientState): ClientGameAction[] {
  let actions: ClientGameAction[] = [];

  if (state.gameStatus !== "RUNNING") return [];

  if (!state.currentAction && !state.blockAction && state.isMyTurn) {
    if (state.thisPlayer.coins >= 10) {
      actions = [ClientGameAction.COUP];
    } else {
      actions = [
        ClientGameAction.EXCHANGE,
        ClientGameAction.FOREIGN_AID,
        ClientGameAction.INCOME,
        ClientGameAction.STEAL,
        ClientGameAction.TAX,
      ];
      if (state.thisPlayer.coins >= 3)
        actions.push(ClientGameAction.ASSASSINATE);
      if (state.thisPlayer.coins >= 7) actions.push(ClientGameAction.COUP);
    }
  }

  if (state.currentAction && !state.blockAction && !state.isMyTurn) {
    const blockableActions = [
      GameActionMove.ASSASSINATE,
      GameActionMove.FOREIGN_AID,
      GameActionMove.STEAL,
    ];
    if (blockableActions.includes(state.currentAction.action!))
      actions.push(ClientGameAction.BLOCK_ACTION);

    const challengeableActions = [
      GameActionMove.ASSASSINATE,
      GameActionMove.EXCHANGE,
      GameActionMove.STEAL,
      GameActionMove.TAX,
    ];
    if (challengeableActions.includes(state.currentAction.action!))
      actions.push(ClientGameAction.CHALLENGE_ACTION);

    if (state.currentAction.targetPlayer === state.thisPlayer.name)
      actions.push(ClientGameAction.CONFIRM_ACTION);
  }

  if (state.blockAction) {
    // current player can accept a block
    if (state.currentPlayerName === state.thisPlayer.name) {
      actions.push(ClientGameAction.ACCEPT_BLOCK);
    }

    // everyone except blocker can challenge a block
    if (state.blockAction.user !== state.thisPlayer.name)
      actions.push(ClientGameAction.CHALLENGE_BLOCK);
  }

  return actions;
}
