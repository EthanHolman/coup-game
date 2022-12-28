import { Deck } from "./Deck";
import { GameActionMove } from "./enums";
import { Player } from "./Player";

export class GameState {
  currentPlayerId: number;
  currentSecondaryPlayerId: number;
  activeAction: GameActionMove;
  gameStatus: "PRE_GAME" | "RUNNING" | "PAUSED";
  deck: Deck;
  private _players: Player[];

  constructor() {
    this.currentPlayerId = 0;
    this.currentSecondaryPlayerId = -1;
    this.activeAction = GameActionMove.NONE;
    this.gameStatus = "PRE_GAME";
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

  get players(): Player[] {
    return this._players;
  }

  addPlayer(player: Player): void {
    this._players.push(player);
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
    this.gameStatus = "PAUSED";
  }

  resume() {
    this.gameStatus = "RUNNING";
  }
}
