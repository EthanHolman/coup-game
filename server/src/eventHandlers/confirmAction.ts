import { GameState } from "../GameState";
import { GameEvent, messageAllFn } from "../types";
import { nextTurn } from "./nextTurn";
import { processPlay } from "./processPlay";

export function confirmAction(
  state: GameState,
  gameEvent: GameEvent,
  messageAllFn: messageAllFn
) {
  if (gameEvent.data.action !== state.activeAction)
    throw "you can't change your mind now!";

  processPlay(state, gameEvent);
  messageAllFn(gameEvent);
  nextTurn(state);
}
