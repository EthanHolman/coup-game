import { GameActionMove, GameEventType } from "../../shared/enums";
import { challengeAction } from "./eventHandlers/challengeAction";
import { confirmAction } from "./eventHandlers/confirmAction";
import { playerJoinGame } from "./eventHandlers/playerJoinGame";
import { playerRevealCard } from "./eventHandlers/playerRevealCard";
import { chooseAction } from "./eventHandlers/chooseAction";
import { startGame } from "./eventHandlers/startGame";
import { GameState } from "./GameState";
import { messagePlayerFn, messageAllFn } from "./messageFnTypes";
import { playerDisconnect } from "./eventHandlers/playerDisconnect";
import { acceptBlock } from "./eventHandlers/acceptBlock";
import { GameEvent } from "../../shared/GameEvent";
import { sendCurrentState } from "./actions/sendCurrentState";
import { blockAction } from "./eventHandlers/blockAction";
import { challengeBlock } from "./eventHandlers/challengeBlock";
import { nextTurn } from "./actions/nextTurn";

export const ACTIONS_ALLOWED_WHILE_PAUSED = [
  GameEventType.PLAYER_DISCONNECT,
  GameEventType.PLAYER_JOIN_GAME,
];

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
      this._gameState.isPaused &&
      !ACTIONS_ALLOWED_WHILE_PAUSED.includes(gameEvent.event)
    ) {
      throw "no actions are allowed until the game is unpaused!";
    }

    // TODO: validate gameEvent (make sure it includes user and no weird/malformed data)

    switch (gameEvent.event) {
      case GameEventType.START_GAME:
        startGame(this._gameState, this._messageAllFn);
        break;

      case GameEventType.PLAYER_JOIN_GAME:
        playerJoinGame(this._gameState, gameEvent, this._messageAllFn);
        break;

      case GameEventType.CHOOSE_ACTION:
        chooseAction(this._gameState, gameEvent, this._messageAllFn);

        // Income action is auto-confirmed
        if (this._gameState.currentAction?.action === GameActionMove.INCOME) {
          confirmAction(this._gameState, gameEvent, this._messageAllFn, true);
        }
        break;

      case GameEventType.CONFIRM_ACTION:
        confirmAction(this._gameState, gameEvent, this._messageAllFn);
        break;

      case GameEventType.CHALLENGE_ACTION:
        challengeAction(this._gameState, gameEvent, this._messageAllFn);
        break;

      case GameEventType.BLOCK_ACTION:
        blockAction(this._gameState, gameEvent, this._messageAllFn);
        break;

      case GameEventType.ACCEPT_BLOCK:
        acceptBlock(this._gameState, gameEvent, this._messageAllFn);
        break;

      case GameEventType.CHALLENGE_BLOCK:
        challengeBlock(this._gameState, gameEvent, this._messageAllFn);
        break;

      case GameEventType.PLAYER_REVEAL_CARD:
        playerRevealCard(this._gameState, gameEvent, this._messageAllFn);

        // In case of 'challenge' card losses, still want to
        //  process currentAction if it's set
        if (this._gameState.currentAction) {
          confirmAction(this._gameState, gameEvent, this._messageAllFn, true);
        } else nextTurn(this._gameState, this._messageAllFn);
        break;

      case GameEventType.PLAYER_DISCONNECT:
        playerDisconnect(this._gameState, gameEvent, this._messageAllFn);
        break;

      default:
        throw `cannot process unexpected action ${gameEvent.event}`;
    }

    // provide clients with updated state after each turn. note that
    //  state updates may occur more frequently as needed
    if (this._gameState.players.length > 0)
      sendCurrentState(this._gameState, this._messagePlayer);
  }
}
