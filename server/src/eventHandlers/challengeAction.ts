import { dispatchPlayerLoseCard } from "../actions/dispatchPlayerLoseCard";
import { GameState } from "../GameState";
import { getRequiredCardForAction } from "../utils/getRequiredCardForAction";
import { GameEvent } from "../../../shared/GameEvent";

export function challengeAction(state: GameState, gameEvent: GameEvent) {
  const requiredCardForAction = getRequiredCardForAction(
    state.currentAction!.action!
  );
  const playerToLoseCard = state.currentPlayer.hasCard(requiredCardForAction)
    ? gameEvent.user
    : state.currentPlayer.name;

  dispatchPlayerLoseCard(state, playerToLoseCard, "player lost the challenge");

  // TODO: message all players what happened
}
