import { GameState } from "../GameState";
import { GameEvent } from "../types";
import { nextTurn } from "../actions/nextTurn";

export function playerLoseCard(state: GameState, gameEvent: GameEvent) {
  if (state.currentSecondaryPlayer.name === gameEvent.user) {
    state.currentSecondaryPlayer.revealCard(gameEvent.data!.card!);
    // TODO: message all users who lost what card
    nextTurn(state);
  } else throw `wrong user!`;
}
