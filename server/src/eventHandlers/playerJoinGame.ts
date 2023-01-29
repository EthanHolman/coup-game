import { resumeGame } from "../actions/resumeGame";
import { GameEvent } from "../../../shared/GameEvent";
import { createServerEvent } from "../utils/createServerEvent";
import { GameState } from "../GameState";
import { Player } from "../Player";
import { messageAllFn, messagePlayerFn } from "../messageFnTypes";
import { GameEventType } from "../../../shared/enums";

export function playerJoinGame(
  state: GameState,
  gameEvent: GameEvent,
  messageAllFn: messageAllFn,
  messagePlayerFn: messagePlayerFn
) {
  if (state.gameStatus !== "PRE_GAME") {
    // allow disconnected players to reconnect
    const player = state.players.find(
      (x) => x.name === gameEvent.user && !x.isConnected
    );
    if (player) {
      player.isConnected = true;

      // if everyone is re-connected, restart the game
      if (!state.players.map((x) => x.isConnected).includes(false))
        resumeGame(state, messageAllFn, "all players have reconnected!");

      // TODO: reconnecting player needs to know what is currently happening

      return;
    }

    throw `game has already started.`;
  }

  if (state.players.map((x) => x.name).includes(gameEvent.user))
    throw `the username ${gameEvent.user} has already been taken`;

  const newPlayerCards = state.deck.drawCard(2);
  const newPlayer = new Player(gameEvent.user, newPlayerCards);
  state.addPlayer(newPlayer);

  // send initial game state to new player
  const playerEvent = createServerEvent(GameEventType.WELCOME, {
    playerNames: state.players.map((x) => x.name),
  });
  messagePlayerFn(newPlayer.name, playerEvent);

  // message everyone that new player joined
  messageAllFn(gameEvent);
}
