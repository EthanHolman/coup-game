import { GameState } from "./GameState";

export interface IGameStateStore {
  listGameCodes(): string[];

  getState(gameCode: string): GameState;

  setState(gameCode: string, updatedState: GameState): GameState;

  createNewGame(): GameState;
}
