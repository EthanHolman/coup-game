import { GameEventType } from "../../../shared/enums";
import { GameState } from "../GameState";
import { messageAllFn } from "../messageFnTypes";
import { createServerEvent } from "../utils/createServerEvent";

export function dispatchPlayerLoseCard(
  state: GameState,
  player: string,
  reason: string,
  messageAllFn: messageAllFn
) {
  if (state.playerLosingCard)
    throw `${state.playerLosingCard.player} is already losing a card`;

  if (!state.players.find((x) => x.name === player))
    throw `could not find player ${player}`;

  state.playerLosingCard = { player, reason };

  messageAllFn(
    createServerEvent(GameEventType.PLAYER_LOSE_CARD, {
      targetPlayer: player,
      reason,
    })
  );
}
