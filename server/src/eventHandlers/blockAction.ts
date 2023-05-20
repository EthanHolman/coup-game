import { Card } from "../../../shared/Card";
import { GameEvent } from "../../../shared/GameEvent";
import { BLOCKABLE_ACTIONS, GameActionMove } from "../../../shared/enums";
import { GameState } from "../GameState";

export function blockAction(state: GameState, gameEvent: GameEvent) {
  if (!state.currentAction) throw "There is no current action in play yet";

  if (state.blockAction) throw "There is already a block action in play";

  if (gameEvent.user === state.currentPlayer.name)
    throw "Cannot block your own action";

  if (!gameEvent.data?.card) throw "Missing card to block with";

  if (!BLOCKABLE_ACTIONS.includes(state.currentAction.action!))
    throw "cannot block non-blockable action";

  if (state.currentAction.action === GameActionMove.ASSASSINATE) {
    if (gameEvent.data.card !== Card.CONTESSA)
      throw "blocking assassination requires contessa";
    if (gameEvent.user !== state.currentAction.targetPlayer)
      throw "Only the target player can block using a contessa";
  } else if (state.currentAction.action === GameActionMove.FOREIGN_AID) {
    if (gameEvent.data.card !== Card.DUKE)
      throw "Blocking foreign aid requires duke";
  } else if (state.currentAction.action === GameActionMove.STEAL) {
    if (![Card.AMBASSADOR, Card.CAPTAIN].includes(gameEvent.data.card))
      throw "Blocking stealing requires ambassador or captain";
  } else
    throw `Missing block validator for action ${state.currentAction.action}`;

  state.blockAction = gameEvent;
}
