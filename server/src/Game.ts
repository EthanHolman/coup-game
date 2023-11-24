import { AUTO_CONFIRMING_ACTIONS, GameEventType } from "../../shared/enums";
import { challengeAction } from "./eventHandlers/challengeAction";
import { confirmAction } from "./eventHandlers/confirmAction";
import { playerJoinGame } from "./eventHandlers/playerJoinGame";
import { playerRevealCard } from "./eventHandlers/playerRevealCard";
import { chooseAction } from "./eventHandlers/chooseAction";
import { startGame } from "./eventHandlers/startGame";
import { messagePlayerFn, messageAllFn } from "./messageFnTypes";
import { playerDisconnect } from "./eventHandlers/playerDisconnect";
import { acceptBlock } from "./eventHandlers/acceptBlock";
import { GameEvent } from "../../shared/GameEvent";
import { sendCurrentStateFn } from "./actions/sendCurrentState";
import { blockAction } from "./eventHandlers/blockAction";
import { challengeBlock } from "./eventHandlers/challengeBlock";
import { nextTurn } from "./actions/nextTurn";
import { exchangeCards } from "./eventHandlers/exchangeCards";
import { newGame } from "./eventHandlers/newGame";
import { IGameStateStore } from "./IGameStateStore";

export const ACTIONS_ALLOWED_WHILE_PAUSED = [
  GameEventType.PLAYER_DISCONNECT,
  GameEventType.PLAYER_JOIN_GAME,
];

export class GameRunner {
  _messagePlayer: messagePlayerFn;
  _messageAllFn: messageAllFn;
  _gameStateStore: IGameStateStore;
  _sendCurrentStateFn: sendCurrentStateFn;

  constructor({
    messagePlayer,
    messageAll,
    gameStateStore,
    sendCurrentStateFn,
  }: {
    messagePlayer: messagePlayerFn;
    messageAll: messageAllFn;
    gameStateStore: IGameStateStore;
    sendCurrentStateFn: sendCurrentStateFn;
  }) {
    this._messagePlayer = messagePlayer;
    this._messageAllFn = messageAll;
    this._gameStateStore = gameStateStore;
    this._sendCurrentStateFn = sendCurrentStateFn;
  }

  onEvent(gameCode: string, gameEvent: GameEvent) {
    const state = this._gameStateStore.getState(gameCode);

    if (
      state.isPaused &&
      !ACTIONS_ALLOWED_WHILE_PAUSED.includes(gameEvent.event)
    ) {
      throw "no actions are allowed until the game is unpaused!";
    }

    // TODO: validate gameEvent (make sure it includes user and no weird/malformed data)

    switch (gameEvent.event) {
      case GameEventType.START_GAME:
        startGame(state, gameEvent, this._messageAllFn);
        break;

      case GameEventType.PLAYER_JOIN_GAME:
        playerJoinGame(state, gameEvent, this._messageAllFn);
        break;

      case GameEventType.CHOOSE_ACTION:
        chooseAction(state, gameEvent, this._messageAllFn);

        // Income action is auto-confirmed
        if (AUTO_CONFIRMING_ACTIONS.includes(state.currentAction?.action!)) {
          confirmAction(state, gameEvent, this._messageAllFn, true);
        }
        break;

      case GameEventType.CONFIRM_ACTION:
        confirmAction(state, gameEvent, this._messageAllFn);
        break;

      case GameEventType.CHALLENGE_ACTION:
        challengeAction(state, gameEvent, this._messageAllFn);
        break;

      case GameEventType.BLOCK_ACTION:
        blockAction(state, gameEvent, this._messageAllFn);
        break;

      case GameEventType.ACCEPT_BLOCK:
        acceptBlock(state, gameEvent, this._messageAllFn);
        break;

      case GameEventType.CHALLENGE_BLOCK:
        challengeBlock(state, gameEvent, this._messageAllFn);
        break;

      case GameEventType.PLAYER_REVEAL_CARD:
        playerRevealCard(state, gameEvent, this._messageAllFn);

        // In case of 'challenge' card losses, still want to
        //  process currentAction if it's set
        if (state.currentAction) {
          confirmAction(state, gameEvent, this._messageAllFn, true);
        } else nextTurn(state, this._messageAllFn);
        break;

      case GameEventType.PLAYER_DISCONNECT:
        playerDisconnect(state, gameEvent, this._messageAllFn);
        break;

      case GameEventType.EXCHANGE_CARDS:
        exchangeCards(state, gameEvent, this._messageAllFn);
        break;

      case GameEventType.NEW_GAME:
        const newGameState = newGame(state, gameEvent, this._messageAllFn);
        this._gameStateStore.setState(gameCode, newGameState);
        break;

      default:
        throw `cannot process unexpected action ${gameEvent.event}`;
    }

    // provide clients with updated state after each turn. note that
    //  state updates may occur more frequently as needed
    this._sendCurrentStateFn(state, this._messagePlayer);
  }
}
