import { dispatchPlayerLoseCard } from "../actions/dispatchPlayerLoseCard";
import { GameState } from "../GameState";
import { getRequiredCardForAction } from "../utils/getRequiredCardForAction";
import { GameEvent } from "../../../shared/GameEvent";
import { GameStatus } from "../../../shared/enums";
import { givePlayerNewCard } from "../actions/givePlayerNewCard";
import { messageAllFn } from "../messageFnTypes";

export function challengeAction(
  state: GameState,
  gameEvent: GameEvent,
  messageAllFn: messageAllFn
) {
  if (state.getStatus() !== GameStatus.ACTION_SELECTED)
    throw "challengeAction only valid when status = ACTION_SELECTED";

  if (gameEvent.user === state.currentPlayer.name)
    throw "cannot challenge your own action";

  messageAllFn(gameEvent);

  const requiredCard = getRequiredCardForAction(state.currentAction!.action!);
  const hasRequiredCard = state.currentPlayer.hasCard(requiredCard);

  if (hasRequiredCard) {
    dispatchPlayerLoseCard(
      state,
      gameEvent.user,
      `${state.currentPlayer.name} has a ${requiredCard}, and the challenge failed`,
      messageAllFn
    );
    givePlayerNewCard(state, state.currentPlayer, requiredCard);
  } else {
    dispatchPlayerLoseCard(
      state,
      state.currentPlayer.name,
      `${gameEvent.user} called your bluff`,
      messageAllFn
    );
    state.clearCurrentAction();
  }
}
