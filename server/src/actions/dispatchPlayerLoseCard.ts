import { GameActionMove, GameEventType } from "../enums";
import { GameState } from "../GameState";
import { messagePlayerFn, ServerEvent } from "../types";

export function dispatchPlayerLoseCard(
  state: GameState,
  player: string,
  reason: GameActionMove,
  messagePlayerFn: messagePlayerFn
) {
  if (state.currentSecondaryPlayerId !== -1)
    throw `there is already a currentSecondaryPlayer: ${state.currentSecondaryPlayerId}`;

  state.setCurrentSecondaryPlayerByName(player);

  const event: ServerEvent = {
    event: GameEventType.PLAYER_LOSE_CARD,
    data: { reason }, // TODO: can reason just pull from state.activeAction?
  };

  messagePlayerFn(player, event);
}
