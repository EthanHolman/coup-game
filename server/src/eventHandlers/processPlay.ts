import { GameActionMove } from "../enums";
import { GameState } from "../GameState";
import { GameEvent } from "../types";

export function processPlay(state: GameState, gameEvent: GameEvent): void {
  switch (gameEvent.data.action) {
    case GameActionMove.ASSASSINATE:
      break;
    case GameActionMove.COUP:
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
      break;
    case GameActionMove.TAX:
      break;
    default:
      throw `cannot process unexpected action ${gameEvent.data.action}`;
  }
}
