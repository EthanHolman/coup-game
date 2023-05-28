import { GameState } from "../GameState";
import { nextTurn } from "../actions/nextTurn";
import { GameEvent } from "../../../shared/GameEvent";

export function playerLoseCard(state: GameState, gameEvent: GameEvent) {
  if (state.playerLosingCard === gameEvent.user) {
    if (!gameEvent.data || !gameEvent.data.card) throw "missing card to lose";

    const player = state.players.find((x) => x.name === state.playerLosingCard);
    if (!player) throw `unable to find player ${state.playerLosingCard}`;

    player.revealCard(gameEvent.data.card);
    // TODO: message all users who lost what card
    nextTurn(state);
  } else throw `wrong user!`;
}
