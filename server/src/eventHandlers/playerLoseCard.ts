import { GameState, GameStatus } from "../GameState";
import { GameEvent } from "../../../shared/GameEvent";

export function playerLoseCard(state: GameState, gameEvent: GameEvent) {
  if (state.status !== GameStatus.PLAYER_LOSING_CARD)
    throw "playerLoseCard only valid when status = PLAYER_LOSING_CARD";
  if (state.playerLosingCard !== gameEvent.user) throw "wrong user!";
  if (!gameEvent.data || !gameEvent.data.card) throw "missing card to lose";

  const player = state.players.find((x) => x.name === state.playerLosingCard);
  if (!player) throw `unable to find player ${state.playerLosingCard}`;

  player.revealCard(gameEvent.data.card);

  state.playerLosingCard = undefined;

  // TODO: message all users who lost what card
}
