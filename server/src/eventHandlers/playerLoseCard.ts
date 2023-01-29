import { GameState } from "../GameState";
import { nextTurn } from "../actions/nextTurn";
import { GameEvent } from "../../../shared/GameEvent";

export function playerLoseCard(state: GameState, gameEvent: GameEvent) {
  if (state.currentSecondaryPlayer.name === gameEvent.user) {
    state.currentSecondaryPlayer.revealCard(gameEvent.data!.card!);
    // TODO: message all users who lost what card
    nextTurn(state);
  } else throw `wrong user!`;
}
