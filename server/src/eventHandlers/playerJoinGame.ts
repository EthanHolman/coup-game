import { GameEventType } from "../enums";
import { GameState } from "../GameState";
import { Player } from "../Player";
import {
  GameEvent,
  messageAllFn,
  messagePlayerFn,
  ServerEvent,
} from "../types";

export function playerJoinGame(
  state: GameState,
  gameEvent: GameEvent,
  messageAllFn: messageAllFn,
  messagePlayerFn: messagePlayerFn
) {
  if (state.gameStarted) throw `game has already started.`;
  if (state.players.map((x) => x.name).includes(gameEvent.user))
    throw `the username ${gameEvent.user} has already been taken`;

  const newPlayerCards = state.deck.drawCard(2);
  const newPlayer = new Player(gameEvent.user, newPlayerCards);
  state.players.push(newPlayer);

  // send initial game state to new player
  const playerEvent: ServerEvent = {
    event: GameEventType.WELCOME,
    data: {
      playerNames: state.players.map((x) => x.name),
    },
  };
  messagePlayerFn(newPlayer.name, playerEvent);

  // message everyone that new player joined
  const everyoneEvent: ServerEvent = {
    event: GameEventType.PLAYER_JOIN_GAME,
    data: {
      name: newPlayer.name,
      // TODO: include player data with this message
    },
  };
  messageAllFn(everyoneEvent);
}
