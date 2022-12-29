import { GameActionMove, GameEventType } from "../enums";
import { GameState } from "../GameState";
import { messagePlayerFn, ServerEvent } from "../types";

export function dispatchPlayerLoseCard(
  state: GameState,
  player: string,
  reason: GameActionMove,
  messagePlayerFn: messagePlayerFn
) {
  // TODO: do we need an activeSecondaryAction?
  state.activeAction = GameActionMove.LOSE_CARD;
  state.setCurrentSecondaryPlayerByName(player);

  const event: ServerEvent = {
    event: GameEventType.PLAYER_LOSE_CARD,
    data: { reason }, // TODO: can reason just pull from state.activeAction
  }; 

  messagePlayerFn(state.currentSecondaryPlayer.name, event);
}
