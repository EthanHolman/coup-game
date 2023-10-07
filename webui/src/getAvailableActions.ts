import { Card } from "../../shared/Card";
import {
  BLOCKABLE_ACTIONS,
  CHALLENGEABLE_ACTIONS,
  GameActionMove,
  GameEventOrAction,
  GameEventType,
  GameStatus,
  NON_TARGETED_ACTIONS,
} from "../../shared/enums";
import { getBlockActionAsCards } from "../../shared/getBlockActionAsCards";
import { ClientState } from "./ClientState";

export class ClientGameAction {
  action: GameEventOrAction;
  timeout?: boolean;
  blockAsCards?: Card[];

  constructor(
    action: GameEventOrAction,
    timeout = false,
    blockAsCards: Card[] | undefined = undefined
  ) {
    this.action = action;
    this.timeout = timeout;
    this.blockAsCards = blockAsCards;
  }
}

export function getAvailableActions(state: ClientState): ClientGameAction[] {
  const actions: ClientGameAction[] = [];

  if (
    state.isPaused ||
    state.status === GameStatus.PRE_GAME ||
    state.status === GameStatus.PLAYER_LOSING_CARD ||
    state.status === GameStatus.GAME_OVER
  )
    return [];

  if (state.isMyTurn && state.status === GameStatus.AWAITING_ACTION) {
    if (state.thisPlayer.coins >= 10) {
      actions.push(new ClientGameAction(GameActionMove.COUP));
    } else {
      actions.push(new ClientGameAction(GameActionMove.EXCHANGE));
      actions.push(new ClientGameAction(GameActionMove.FOREIGN_AID));
      actions.push(new ClientGameAction(GameActionMove.INCOME));
      actions.push(new ClientGameAction(GameActionMove.STEAL));
      actions.push(new ClientGameAction(GameActionMove.TAX));

      if (state.thisPlayer.coins >= 3)
        actions.push(new ClientGameAction(GameActionMove.ASSASSINATE));
      if (state.thisPlayer.coins >= 7)
        actions.push(new ClientGameAction(GameActionMove.COUP));
    }
  }

  if (
    state.isMyTurn &&
    state.status === GameStatus.ACTION_SELECTED &&
    state.currentAction?.action &&
    NON_TARGETED_ACTIONS.includes(state.currentAction.action)
  )
    actions.push(new ClientGameAction(GameEventType.CONFIRM_ACTION, true));

  if (
    !state.isMyTurn &&
    state.status === GameStatus.ACTION_SELECTED &&
    state.currentAction?.action
  ) {
    if (BLOCKABLE_ACTIONS.includes(state.currentAction.action))
      actions.push(
        new ClientGameAction(
          GameEventType.BLOCK_ACTION,
          false,
          getBlockActionAsCards(state.currentAction.action)
        )
      );

    if (CHALLENGEABLE_ACTIONS.includes(state.currentAction.action))
      actions.push(new ClientGameAction(GameEventType.CHALLENGE_ACTION));

    if (state.currentAction?.targetPlayer === state.thisPlayer.name)
      actions.push(new ClientGameAction(GameEventType.CONFIRM_ACTION));
  }

  if (state.status === GameStatus.ACTION_BLOCKED) {
    // current player can accept a block
    if (state.isMyTurn) {
      actions.push(new ClientGameAction(GameEventType.ACCEPT_BLOCK));
    }

    // everyone except blocker can challenge a block
    if (state.blockAction?.user !== state.thisPlayer.name)
      actions.push(new ClientGameAction(GameEventType.CHALLENGE_BLOCK));
  }

  return actions;
}
