import { Deck } from "./Deck";
import { Player } from "./Player";
import { GameEvent, GameEventData } from "../../shared/GameEvent";

export class GameState {
  currentPlayerId: number;
  currentSecondaryPlayerId: number;
  currentAction?: GameEventData;
  blockAction?: GameEvent;
  _gameStatus: "PRE_GAME" | "RUNNING" | "PAUSED";
  deck: Deck;
  private _players: Player[];

  constructor() {
    this.currentPlayerId = 0;
    this.currentSecondaryPlayerId = -1;
    this.currentAction = undefined;
    this.blockAction = undefined;
    this._gameStatus = "PRE_GAME";
    this.deck = new Deck();
    this._players = [];
  }

  get currentPlayer(): Player {
    return this._players[this.currentPlayerId];
  }

  get currentSecondaryPlayer(): Player {
    if (this.currentSecondaryPlayerId === -1)
      throw "there is not currently a secondary player in state";

    return this._players[this.currentSecondaryPlayerId];
  }

  get players(): ReadonlyArray<Player> {
    return this._players;
  }

  get gameStatus() {
    return this._gameStatus;
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

  setCurrentSecondaryPlayerByName(playerName: string) {
    const index = this._players.findIndex((x) => x.name === playerName);
    if (index === -1) throw `unable to find player ${playerName}`;
    this.currentSecondaryPlayerId = index;
  }

  setCurrentSecondaryPlayerById(playerId: number) {
    if (playerId > this._players.length - 1 || playerId < 0)
      throw `playerId is out of range`;
    this.currentSecondaryPlayerId = playerId;
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
