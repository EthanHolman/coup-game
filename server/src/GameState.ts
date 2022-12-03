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
    if (this.currentSecondaryPlayerId === -1)
      throw "there is not currently a secondary player in state";

    return this.players[this.currentSecondaryPlayerId];
  }

  setCurrentSecondaryPlayerByName(playerName: string) {
    const index = this.players.findIndex((x) => x.name === playerName);
    if (index === -1) throw `unable to find player ${playerName}`;
    this.currentSecondaryPlayerId = index;
  }

  setCurrentSecondaryPlayerById(playerId: number) {
    if (playerId > this.players.length - 1 || playerId < 0)
      throw `playerId is out of range`;
    this.currentSecondaryPlayerId = playerId;
  }
}
