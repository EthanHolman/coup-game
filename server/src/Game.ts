import { Deck } from "./Deck";
import { Card, GameActionMove, GameEventType } from "./enums";
import { Player } from "./Player";

export type messagePlayerFn = (playerName: string, data: any) => void;

export type messageAllFn = (data: any) => void;

type ServerEvent = {
  event: GameEventType;
};

type GameEvent = {
  event: GameEventType;
  user: string;
  data: any;
};

type GameState = {
  currentPlayerId: number;
  currentSecondaryPlayerId: number;
  activeAction: GameActionMove;
  gameStarted: boolean;
  deck: Deck;
  players: Player[];
};

function initNewGame(): GameState {
  return {
    currentPlayerId: 0,
    currentSecondaryPlayerId: -1,
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

  get currentPlayer(): Player {
    return this._gameState.players[this._gameState.currentPlayerId];
  }

  get currentSecondaryPlayer(): Player {
    return this._gameState.players[this._gameState.currentSecondaryPlayerId];
  }

  onEvent(gameEvent: GameEvent) {
    switch (gameEvent.event) {
      case GameEventType.START_GAME:
        if (this._gameState.players.length < 2)
          throw "at least 2 players must join before you can play";

        this.startGame();
        // TODO: send 'game started' event to all clients
        break;

      case GameEventType.PLAYER_JOIN_GAME:
        if (
          !this._gameState.gameStarted &&
          !this._gameState.players.map((x) => x.name).includes(gameEvent.user)
        ) {
          this.addPlayer(gameEvent.user);
          // TODO: send 'player joined' event to all clients
        }
        break;

      case GameEventType.PROPOSE_ACTION:
        // might want to validate incoming action
        this._gameState.activeAction = gameEvent.data.action;
        this._messageAllFn(gameEvent);
        break;

      case GameEventType.CONFIRM_ACTION:
        if (gameEvent.data.action !== this._gameState.activeAction)
          throw "you can't change your mind now!";

        this.processPlay(gameEvent);
        this._messageAllFn(gameEvent);
        this.nextTurn();
        break;

      case GameEventType.NEVERMIND_ACTION:
        this._messageAllFn(gameEvent);
        this.nextTurn();
        break;

      case GameEventType.CALL_BS:
        const requiredCardForAction = getRequiredCardForAction(
          this._gameState.activeAction
        );
        const event: ServerEvent = { event: GameEventType.PLAYER_LOSE_CARD };
        const playerToLoseCard = this.currentPlayer.hasCard(
          requiredCardForAction
        )
          ? gameEvent.user
          : this.currentPlayer.name;

        this._gameState.currentSecondaryPlayerId =
          this._gameState.players.findIndex((x) => x.name === playerToLoseCard);
        this._messagePlayer(playerToLoseCard, event);
      // TODO: message all players what happened

      case GameEventType.PLAYER_LOSE_CARD:
        if (this.currentSecondaryPlayer.name === gameEvent.user) {
          this.currentSecondaryPlayer.revealCard(gameEvent.data.card);
          // TODO: message all users who lost what card
          this.nextTurn();
        } else throw `wrong user!`;

      case GameEventType.BLOCK_ACTION:
        break;

      default:
        throw `cannot process unexpected action ${gameEvent.event}`;
    }
  }

  addPlayer(name: string): void {
    const newPlayerCards = this._gameState.deck.drawCard(2);
    const newPlayer = new Player(name, newPlayerCards);
    this._gameState.players.push(newPlayer);
  }

  startGame(): void {
    this._gameState.gameStarted = true;
    this._gameState.currentPlayerId = 0;
  }

  nextTurn(): void {
    this._gameState.currentPlayerId =
      (this._gameState.currentPlayerId + 1) % this._gameState.players.length;
    this._gameState.activeAction = GameActionMove.NONE;
    this._gameState.currentSecondaryPlayerId = -1;
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
}

function getRequiredCardForAction(action: GameActionMove): Card {
  switch (action) {
    case GameActionMove.STEAL:
      return Card.CAPTAIN;
    case GameActionMove.ASSASSINATE:
      return Card.ASSASSIN;
    case GameActionMove.TAX:
      return Card.DUKE;
    case GameActionMove.EXCHANGE:
      return Card.AMBASSADOR;
    default:
      throw `you dont need a card to perform ${action}`;
  }
}
