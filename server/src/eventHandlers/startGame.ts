import { GameEventType, GameStatus } from "../../../shared/enums";
import { createServerEvent } from "../utils/createServerEvent";
import { GameState } from "../GameState";
import { messageAllFn } from "../messageFnTypes";
import { GameEvent } from "../../../shared/GameEvent";

export function startGame(
  state: GameState,
  gameEvent: GameEvent,
  messageAllFn: messageAllFn
) {
  const thisPlayer = state.players.find((x) => x.name === gameEvent.user);
  if (!thisPlayer?.isHost) throw "Only the host can start the game";

  if (state.players.length < 2)
    throw "at least 2 players must join before you can play";

  const gameStatus = state.getStatus();
  if (gameStatus !== GameStatus.PRE_GAME)
    throw `expecting gameStatus to be pregame, not ${gameStatus}`;

  state.start();
  state.currentPlayerId = 0;

  const event = createServerEvent(GameEventType.START_GAME);

  messageAllFn(event);
}
