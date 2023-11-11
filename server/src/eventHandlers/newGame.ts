import { GameEvent } from "../../../shared/GameEvent";
import { GameEventType } from "../../../shared/enums";
import { GameState } from "../GameState";
import { addNewPlayer } from "../actions/addNewPlayer";
import { messageAllFn } from "../messageFnTypes";
import { createServerEvent } from "../utils/createServerEvent";

export function newGame(
  state: GameState,
  gameEvent: GameEvent,
  messageAllFn: messageAllFn
): GameState {
  // TODO: might make more sense to have this logic in a 'reset'
  //  function on GameState?
  const thisPlayer = state.players.find((x) => x.name === gameEvent.user);
  if (!thisPlayer?.isHost) throw "Only the host can start a new game";

  const newGameState = new GameState(state.gameCode);
  state.players
    .filter((x) => x.isConnected)
    .forEach((player) => addNewPlayer(newGameState, player.name));

  messageAllFn(state.gameCode, createServerEvent(GameEventType.NEW_GAME));

  return newGameState;
}
