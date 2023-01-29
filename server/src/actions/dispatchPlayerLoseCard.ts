import { GameEventType } from "../../../shared/enums";
import { createServerEvent } from "../utils/createServerEvent";
import { GameState } from "../GameState";
import { messagePlayerFn } from "../messageFnTypes";

export function dispatchPlayerLoseCard(
  state: GameState,
  player: string,
  messagePlayerFn: messagePlayerFn,
  reason: string
) {
  if (state.currentSecondaryPlayerId !== -1)
    throw `there is already a currentSecondaryPlayer: ${state.currentSecondaryPlayerId}`;

  state.setCurrentSecondaryPlayerByName(player);

  const event = createServerEvent(GameEventType.PLAYER_LOSE_CARD, { reason });

  messagePlayerFn(player, event);
}
