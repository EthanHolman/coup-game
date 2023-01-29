import { dispatchPlayerLoseCard } from "../actions/dispatchPlayerLoseCard";
import { GameState } from "../GameState";
import { messagePlayerFn } from "../messageFnTypes";
import { getRequiredCardForAction } from "../utils/getRequiredCardForAction";
import { GameEvent } from "../../../shared/GameEvent";

export function challengeAction(
  state: GameState,
  gameEvent: GameEvent,
  messagePlayerFn: messagePlayerFn
) {
  const requiredCardForAction = getRequiredCardForAction(
    state.currentAction!.action!
  );
  const playerToLoseCard = state.currentPlayer.hasCard(requiredCardForAction)
    ? gameEvent.user
    : state.currentPlayer.name;

  dispatchPlayerLoseCard(
    state,
    playerToLoseCard,
    messagePlayerFn,
    "player lost the challenge"
  );

  // TODO: message all players what happened
}
