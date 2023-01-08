import { GameState } from "../GameState";

export function nextTurn(state: GameState) {
  state.currentPlayerId = (state.currentPlayerId + 1) % state.players.length;
  state.currentAction = undefined;
  state.currentSecondaryPlayerId = -1;
  // TODO: need to send msg to everyone that next turn happend
}
