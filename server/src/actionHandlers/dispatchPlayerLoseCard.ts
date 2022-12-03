import { GameActionMove, GameEventType } from "../enums";
import { GameState } from "../GameState";
import { messagePlayerFn, ServerEvent } from "../types";

export function dispatchPlayerLoseCard(
  state: GameState,
  player: string,
  reason: GameActionMove,
  messagePlayerFn: messagePlayerFn
) {
  state.activeAction = GameActionMove.LOSE_CARD;
  state.setCurrentSecondaryPlayerByName(player);

  const event: ServerEvent = {
    event: GameEventType.PLAYER_LOSE_CARD,
    data: { reason },
  };

  messagePlayerFn(state.currentSecondaryPlayer.name, event);
}
