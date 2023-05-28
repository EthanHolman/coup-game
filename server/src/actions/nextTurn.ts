import { GameState } from "../GameState";

export function nextTurn(state: GameState) {
  state.currentPlayerId = (state.currentPlayerId + 1) % state.players.length;
  state.playerLosingCard = undefined;
  state.currentAction = undefined;
  state.blockAction = undefined;
  // TODO: need to send msg to everyone that next turn happend
}
