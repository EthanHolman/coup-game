import { GameState } from "../GameState";

export function dispatchPlayerLoseCard(
  state: GameState,
  player: string,
  reason: string
) {
  if (state.playerLosingCard)
    throw `${state.playerLosingCard.player} is already losing a card`;

  if (!state.players.find((x) => x.name === player))
    throw `could not find player ${player}`;

  state.playerLosingCard = { player, reason };
}
