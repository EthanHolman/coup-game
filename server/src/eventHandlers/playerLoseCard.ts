import { GameState } from "../GameState";
import { GameEvent } from "../../../shared/GameEvent";
import { GameStatus } from "../../../shared/enums";
import { messageAllFn } from "../messageFnTypes";

export function playerLoseCard(
  state: GameState,
  gameEvent: GameEvent,
  messageAllFn: messageAllFn
) {
  if (state.status !== GameStatus.PLAYER_LOSING_CARD)
    throw "playerLoseCard only valid when status = PLAYER_LOSING_CARD";
  if (state.playerLosingCard?.player !== gameEvent.user) throw "wrong user!";
  if (!gameEvent.data || !gameEvent.data.card) throw "missing card to lose";

  const player = state.players.find(
    (x) => x.name === state.playerLosingCard?.player
  );
  if (!player) throw `unable to find player ${state.playerLosingCard.player}`;

  player.revealCard(gameEvent.data.card);

  state.playerLosingCard = undefined;

  messageAllFn(gameEvent);
}
