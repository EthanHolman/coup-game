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
  if (state.playerLosingCard)
    throw `${state.playerLosingCard.player} is already losing a card`;

  if (!state.players.find((x) => x.name === player))
    throw `could not find player ${player}`;

  state.playerLosingCard = { player, reason };

  // TODO: might not need this event anymore
  const event = createServerEvent(GameEventType.PLAYER_LOSE_CARD, { reason });

  messagePlayerFn(player, event);
}
