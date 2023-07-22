import { GameEventType } from "../../../shared/enums";
import { GameState } from "../GameState";
import { addNewPlayer } from "../actions/addNewPlayer";
import { messageAllFn } from "../messageFnTypes";
import { createServerEvent } from "../utils/createServerEvent";

export function newGame(
  state: GameState,
  messageAllFn: messageAllFn
): GameState {
  const newGameState = new GameState();
  state.players.forEach((player) => addNewPlayer(newGameState, player.name));

  messageAllFn(createServerEvent(GameEventType.NEW_GAME));

  return newGameState;
}
