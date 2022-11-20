import { GameEventType } from "../enums";
import { GameState } from "../GameState";
import { GameEvent, messagePlayerFn, ServerEvent } from "../types";
import { getRequiredCardForAction } from "../utils/getRequiredCardForAction";

export function callBS(
  state: GameState,
  gameEvent: GameEvent,
  messagePlayerFn: messagePlayerFn
) {
  const requiredCardForAction = getRequiredCardForAction(state.activeAction);
  const event: ServerEvent = { event: GameEventType.PLAYER_LOSE_CARD };
  const playerToLoseCard = state.currentPlayer.hasCard(requiredCardForAction)
    ? gameEvent.user
    : state.currentPlayer.name;

  state.currentSecondaryPlayerId = state.players.findIndex(
    (x) => x.name === playerToLoseCard
  );
  messagePlayerFn(playerToLoseCard, event);
  // TODO: message all players what happened
}
