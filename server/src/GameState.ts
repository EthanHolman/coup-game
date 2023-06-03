import { Deck } from "./Deck";
import { Player } from "./Player";
import { GameEvent, GameEventData } from "../../shared/GameEvent";

export enum GameStatus {
  PRE_GAME,
  AWAITING_ACTION,
  ACTION_SELECTED,
  ACTION_BLOCKED,
  PLAYER_LOSING_CARD,
}

export class GameState {
  currentPlayerId: number;
  currentAction?: GameEventData;
  blockAction?: GameEvent;
  playerLosingCard?: string;
  _gameStatus: "PRE_GAME" | "RUNNING" | "PAUSED";
  deck: Deck;
  private _players: Player[];

  constructor() {
    this.currentPlayerId = 0;
    this.currentAction = undefined;
    this.blockAction = undefined;
    this._gameStatus = "PRE_GAME";
    this.deck = new Deck();
    this._players = [];
  }

  get currentPlayer(): Player {
    if (this.currentPlayerId >= this._players.length)
      throw `invalid current player id ${this.currentPlayerId}`;

    return this._players[this.currentPlayerId];
  }

  get players(): ReadonlyArray<Player> {
    return this._players;
  }

  get gameStatus() {
    return this._gameStatus;
  }

  get status(): GameStatus {
    if (this.playerLosingCard) return GameStatus.PLAYER_LOSING_CARD;

    if (!this.currentAction && !this.blockAction && !this.playerLosingCard)
      return GameStatus.AWAITING_ACTION;

    if (this.currentAction && !this.blockAction && !this.playerLosingCard)
      return GameStatus.ACTION_SELECTED;

    if (this.currentAction && this.blockAction && !this.playerLosingCard)
      return GameStatus.ACTION_BLOCKED;

    throw "unable to determine valid GameStatus";
  }

  addPlayer(player: Player): void {
    this._players.push(player);
  }

  removePlayer(name: string): void {
    if (this.gameStatus !== "PRE_GAME")
      throw "players can only be removed during pre-game";

    const index = this.players.findIndex((x) => x.name === name);
    if (index === -1) throw `unable to find player ${name} in state`;

    this._players.splice(index, 1);
  }

  pause() {
    this._gameStatus = "PAUSED";
  }

  resume() {
    this._gameStatus = "RUNNING";
  }

  start() {
    this._gameStatus = "RUNNING";
  }

  clearCurrentAction() {
    this.currentAction = undefined;
  }
}
