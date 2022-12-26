import { GameEventType } from "./enums";
import { callBS } from "./eventHandlers/callBS";
import { confirmAction } from "./eventHandlers/confirmAction";
import { nevermindAction } from "./eventHandlers/nevermindAction";
import { playerJoinGame } from "./eventHandlers/playerJoinGame";
import { playerLoseCard } from "./eventHandlers/playerLoseCard";
import { proposeAction } from "./eventHandlers/proposeAction";
import { startGame } from "./eventHandlers/startGame";
import { GameState } from "./GameState";
import { messagePlayerFn, messageAllFn, GameEvent } from "./types";

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

      case GameEventType.PROPOSE_ACTION:
        // might want to validate incoming action
        proposeAction(this._gameState, gameEvent, this._messageAllFn);
        break;

      case GameEventType.CONFIRM_ACTION:
        confirmAction(
          this._gameState,
          gameEvent,
          this._messageAllFn,
          this._messagePlayer
        );
        break;

      case GameEventType.NEVERMIND_ACTION:
        nevermindAction(this._gameState, gameEvent, this._messageAllFn);
        break;

      case GameEventType.CALL_BS:
        callBS(this._gameState, gameEvent, this._messagePlayer);
        break;

      case GameEventType.PLAYER_LOSE_CARD:
        playerLoseCard(this._gameState, gameEvent);
        break;

      case GameEventType.BLOCK_ACTION:
        break;

      default:
        throw `cannot process unexpected action ${gameEvent.event}`;
    }
  }
}
