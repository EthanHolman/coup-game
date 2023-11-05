import { Deck } from "./Deck";
import { Player } from "./Player";
import { GameEvent, GameEventData } from "../../shared/GameEvent";
import { GameStatus } from "../../shared/enums";
import { PlayerLoseCardAction } from "../../shared/types";
import { Card } from "../../shared/Card";
import { generateGameCode } from "./utils/generateGameCode";

export class GameState {
  private _players: Player[];
  private _isStarted: boolean;

  gameCode: string;
  currentPlayerId: number;
  deck: Deck;
  isPaused: boolean;

  currentAction?: GameEventData;
  blockAction?: GameEvent;
  playerLosingCard?: PlayerLoseCardAction;
  exchangeCards?: Card[];

  constructor() {
    this.gameCode = generateGameCode();
    this._players = [];
    this._isStarted = false;

    this.currentPlayerId = 0;
    this.deck = new Deck();
    this.isPaused = false;
  }

  get currentPlayer(): Player {
    if (this.currentPlayerId >= this._players.length)
      throw `invalid current player id ${this.currentPlayerId}`;

    return this._players[this.currentPlayerId];
  }

  get players(): ReadonlyArray<Player> {
    return this._players;
  }

  getStatus(): GameStatus {
    if (!this._isStarted) return GameStatus.PRE_GAME;

    if (this.players.filter((x) => !x.isOut).length < 2)
      return GameStatus.GAME_OVER;

    if (this.playerLosingCard) return GameStatus.PLAYER_LOSING_CARD;

    if (this.exchangeCards) return GameStatus.AWAITING_EXCHANGE;

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
    if (this.getStatus() !== GameStatus.PRE_GAME)
      throw "players can only be removed during pre-game";

    const index = this.players.findIndex((x) => x.name === name);
    if (index === -1) throw `unable to find player ${name} in state`;

    this._players.splice(index, 1);
  }

  pause() {
    this.isPaused = true;
  }

  resume() {
    this.isPaused = false;
  }

  start() {
    this._isStarted = true;
  }

  clearCurrentAction() {
    this.currentAction = undefined;
  }

  clearBlockAction() {
    this.blockAction = undefined;
  }
}
