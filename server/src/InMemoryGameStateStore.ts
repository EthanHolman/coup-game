import { GameState } from "./GameState";
import { IGameStateStore } from "./IGameStateStore";
import { GameStateNotFoundError, WrongGameCodeError } from "./errors";

export class InMemoryGameStateStore implements IGameStateStore {
  stateMap = new Map<string, GameState>();
  probationGames: string[] = [];

  listGameCodes(): string[] {
    const items: string[] = [];
    this.stateMap.forEach((_, key) => items.push(key));
    return items;
  }

  getState(gameCode: string): GameState {
    const result = this.stateMap.get(gameCode);
    if (!result) throw new GameStateNotFoundError(gameCode);
    return result;
  }

  setState(gameCode: string, updatedState: GameState): GameState {
    if (!this.stateMap.has(gameCode))
      throw new GameStateNotFoundError(gameCode);
    if (updatedState.gameCode !== gameCode) throw new WrongGameCodeError();

    this.stateMap.set(gameCode, updatedState);
    return updatedState;
  }

  createNewGame(): GameState {
    const newState = new GameState();
    this.stateMap.set(newState.gameCode, newState);
    return newState;
  }
}
