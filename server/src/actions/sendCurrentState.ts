import { GameEventType } from "../../../shared/enums";
import { GameState } from "../GameState";
import { messagePlayerFn } from "../messageFnTypes";
import { buildClientState } from "../utils/buildClientState";
import { createServerEvent } from "../utils/createServerEvent";

export type sendCurrentStateFn = (
  state: GameState,
  messagePlayerFn: messagePlayerFn
) => void;

export function sendCurrentState(
  state: GameState,
  messagePlayerFn: messagePlayerFn
) {
  state.players
    .filter((player) => player.isConnected)
    .forEach((player) => {
      const playerClientState = buildClientState(state, player.name);
      const serverEvent = createServerEvent(GameEventType.CURRENT_STATE, {
        state: playerClientState,
      });
      messagePlayerFn(state.gameCode, player.name, serverEvent);
    });
}
