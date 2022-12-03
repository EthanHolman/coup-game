import { dispatchPlayerLoseCard } from "../actionHandlers/dispatchPlayerLoseCard";
import { GameActionMove, GameEventType } from "../enums";
import { GameState } from "../GameState";
import { GameEvent, messageAllFn, messagePlayerFn } from "../types";
import { nextTurn } from "./nextTurn";

export function confirmAction(
  state: GameState,
  gameEvent: GameEvent,
  messageAllFn: messageAllFn,
  messagePlayerFn: messagePlayerFn
) {
  // event validations
  if (gameEvent.user !== state.currentPlayer.name) throw "wrong user!";
  if (gameEvent.data.action !== state.activeAction)
    throw "proposed action does not match requested confirm action";

  // broadcast confirmation to all players
  messageAllFn(gameEvent);

  switch (state.activeAction) {
    case GameActionMove.ASSASSINATE:
      dispatchPlayerLoseCard(
        state,
        gameEvent.data.targetPlayer,
        GameActionMove.ASSASSINATE,
        messagePlayerFn
      );
      break;

    case GameActionMove.COUP:
      dispatchPlayerLoseCard(
        state,
        gameEvent.data.targetPlayer,
        GameActionMove.COUP,
        messagePlayerFn
      );
      break;

    case GameActionMove.EXCHANGE:
      break;

    case GameActionMove.FOREIGN_AID:
      break;

    case GameActionMove.INCOME:
      const player = state.players.find((x) => x.name === gameEvent.user);
      if (!player) throw `unable to find player ${gameEvent.user}`;
      player.coins += 1;
      break;

    case GameActionMove.STEAL:
      const targetPlayer = gameEvent.data.targetPlayer;

      state.currentPlayer.coins += 2;
      break;

    case GameActionMove.TAX:
      state.currentPlayer.coins += 3;
      break;

    default:
      throw `cannot process unexpected action ${state.activeAction}`;
  }

  nextTurn(state);
}
