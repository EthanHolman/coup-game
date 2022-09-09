import { Deck } from "./Deck";
import { Card, GameActionMove, GameEventType } from "./enums";
import { Player } from "./Player";

type messagePlayerFn = (playerName: string, data: any) => void;

type messageAllFn = (data: any) => void;

type GameEvent = {
  event: GameEventType;
  user: string;
  data: any;
};

type GameState = {
  currentPlayer: number;
  activeAction: GameActionMove;
  gameStarted: boolean;
  deck: Deck;
  players: Player[];
};

function initNewGame(): GameState {
  return {
    currentPlayer: 0,
    activeAction: GameActionMove.NONE,
    gameStarted: false,
    deck: new Deck(),
    players: [],
  };
}

export class GameRunner {
  _messagePlayer: messagePlayerFn;
  _messageAllFn: messageAllFn;
  _gameState: GameState;

  constructor({
    messagePlayer,
    messageAll,
  }: {
    messagePlayer: messagePlayerFn;
    messageAll: messageAllFn;
  }) {
    this._messagePlayer = messagePlayer;
    this._messageAllFn = messageAll;

    this._gameState = initNewGame();
  }

  onEvent(gameEvent: GameEvent) {
    switch (gameEvent.event) {
      case GameEventType.START_GAME:
        this.startGame();
        break;
      case GameEventType.PLAYER_JOIN_GAME:
        this.addPlayer(gameEvent.user);
        break;
      case GameEventType.PROPOSE_ACTION:
        this._gameState.activeAction = gameEvent.data.action;
        this._messageAllFn(gameEvent);
        break;
      case GameEventType.CONFIRM_ACTION:
        if (gameEvent.data.action !== this._gameState.activeAction)
          throw "you cant change your mind now!";
        this.processPlay(gameEvent);
        this.nextTurn();
        break;
      case GameEventType.NEVERMIND_ACTION:
        // send nevermind msg
        this.nextTurn();
        break;
      case GameEventType.CALL_BS:
        break;
      case GameEventType.BLOCK_ACTION:
        break;
      default:
        throw `cannot process unexpected action ${gameEvent.event}`;
    }
  }

  addPlayer(name: string): void {
    this._gameState.players.push({
      name,
      cards: [this._gameState.deck.drawCard(), this._gameState.deck.drawCard()],
      coins: name === "ethan" ? 7 : 2,
    });
  }

  startGame(): void {
    this._gameState.gameStarted = true;
    this._gameState.currentPlayer = 0;
  }

  nextTurn(): void {
    this._gameState.currentPlayer =
      (this._gameState.currentPlayer + 1) % this._gameState.players.length;
    this._gameState.activeAction = GameActionMove.NONE;
  }

  processPlay(gameEvent: GameEvent): void {
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
        const player = this._gameState.players.find(
          (x) => x.name === gameEvent.user
        );
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
}
