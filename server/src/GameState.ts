import { Deck } from "./Deck";
import { GameActionMove } from "./enums";
import { Player } from "./Player";

export class GameState {
  currentPlayerId: number;
  currentSecondaryPlayerId: number;
  activeAction: GameActionMove;
  gameStarted: boolean;
  deck: Deck;
  players: Player[];

  constructor() {
    this.currentPlayerId = 0;
    this.currentSecondaryPlayerId = -1;
    this.activeAction = GameActionMove.NONE;
    this.gameStarted = false;
    this.deck = new Deck();
    this.players = [];
  }

  get currentPlayer(): Player {
    return this.players[this.currentPlayerId];
  }

  get currentSecondaryPlayer(): Player {
    return this.players[this.currentSecondaryPlayerId];
  }
}
