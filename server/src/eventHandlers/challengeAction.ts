import { dispatchPlayerLoseCard } from "../actions/dispatchPlayerLoseCard";
import { GameActionMove } from "../enums";
import { GameState } from "../GameState";
import { GameEvent, messagePlayerFn } from "../types";
import { getRequiredCardForAction } from "../utils/getRequiredCardForAction";

export function challengeAction(
  state: GameState,
  gameEvent: GameEvent,
  messagePlayerFn: messagePlayerFn
) {
  const requiredCardForAction = getRequiredCardForAction(state.activeAction);
  const playerToLoseCard = state.currentPlayer.hasCard(requiredCardForAction)
    ? gameEvent.user
    : state.currentPlayer.name;

  dispatchPlayerLoseCard(
    state,
    playerToLoseCard,
    GameActionMove.LOSE_CARD, // TODO: should we make new action for this case?
    messagePlayerFn
  );

  // TODO: message all players what happened
}
