import { GameEventType } from "./enums";
import { challengeAction } from "./eventHandlers/challengeAction";
import { confirmAction } from "./eventHandlers/confirmAction";
import { playerJoinGame } from "./eventHandlers/playerJoinGame";
import { playerLoseCard } from "./eventHandlers/playerLoseCard";
import { chooseAction } from "./eventHandlers/chooseAction";
import { startGame } from "./eventHandlers/startGame";
import { GameState } from "./GameState";
import { messagePlayerFn, messageAllFn, GameEvent } from "./types";
import { playerDisconnect } from "./eventHandlers/playerDisconnect";
import { acceptBlock } from "./eventHandlers/acceptBlock";

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

    this._gameState = new GameState();
  }

  onEvent(gameEvent: GameEvent) {
    if (
      this._gameState.gameStatus === "PAUSED" &&
      ![GameEventType.RESUME_GAME, GameEventType.PLAYER_DISCONNECT].includes(
        gameEvent.event
      )
    ) {
      throw "no actions are allowed until the game is unpaused!";
    }

    switch (gameEvent.event) {
      case GameEventType.START_GAME:
        startGame(this._gameState, this._messageAllFn);
        break;

      case GameEventType.PLAYER_JOIN_GAME:
        playerJoinGame(
          this._gameState,
          gameEvent,
          this._messageAllFn,
          this._messagePlayer
        );
        break;

      case GameEventType.CHOOSE_ACTION:
        chooseAction(this._gameState, gameEvent, this._messageAllFn);
        break;

      case GameEventType.CONFIRM_ACTION:
        confirmAction(
          this._gameState,
          gameEvent,
          this._messageAllFn,
          this._messagePlayer
        );
        break;

      case GameEventType.CHALLENGE_ACTION:
        challengeAction(this._gameState, gameEvent, this._messagePlayer);
        break;

      case GameEventType.BLOCK_ACTION:
        break;

      case GameEventType.ACCEPT_BLOCK:
        acceptBlock(this._gameState, gameEvent, this._messageAllFn);
        break;

      case GameEventType.CHALLENGE_BLOCK:
        break;

      case GameEventType.PLAYER_LOSE_CARD:
        playerLoseCard(this._gameState, gameEvent);
        break;

      case GameEventType.PLAYER_DISCONNECT:
        playerDisconnect(this._gameState, gameEvent, this._messageAllFn);
        break;

      default:
        throw `cannot process unexpected action ${gameEvent.event}`;
    }
  }
}
