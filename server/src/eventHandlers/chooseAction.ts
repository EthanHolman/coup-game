import {
  ALL_PLAYABLE_GAME_ACTION_MOVES,
  GameActionMove,
} from "../../../shared/enums";
import { GameState } from "../GameState";
import { messageAllFn } from "../messageFnTypes";
import { GameEvent } from "../../../shared/GameEvent";

export function chooseAction(
  state: GameState,
  gameEvent: GameEvent,
  messageAllFn: messageAllFn
) {
  if (state.gameStatus !== "RUNNING")
    throw `cannot choose an action when the game is not running`;

  if (gameEvent.user !== state.currentPlayer.name)
    throw `it is not currently ${gameEvent.user}'s turn`;

  // validate action
  if (!ALL_PLAYABLE_GAME_ACTION_MOVES.includes(gameEvent.data?.action!))
    throw `'${gameEvent.data?.action}' is not a valid action`;

  // force coup if currentPlayer has 10 coins
  if (
    state.currentPlayer.coins === 10 &&
    gameEvent.data?.action !== GameActionMove.COUP
  ) {
    throw "you have 10 coins, the only valid play is to COUP";
  }

  // validate targetPlayer if action requires one
  if (
    gameEvent.data?.action === GameActionMove.COUP ||
    gameEvent.data?.action === GameActionMove.ASSASSINATE ||
    gameEvent.data?.action === GameActionMove.STEAL
  ) {
    if (!gameEvent.data.targetPlayer) throw "missing targetPlayer";

    if (
      !state.players
        .filter((x) => !x.isOut && x.name !== gameEvent.user)
        .map((x) => x.name)
        .includes(gameEvent.data.targetPlayer!)
    )
      throw `player ${gameEvent.data.targetPlayer} is not a valid targetPlayer`;
  }

  // if stealing, make sure targetPlayer has enough coins
  if (gameEvent.data?.action === GameActionMove.STEAL) {
    // make sure targetPlayer has at least 1 coin
    const targetPlayer = state.players.find(
      (x) => x.name === gameEvent.data?.targetPlayer
    );
    if (!targetPlayer)
      throw `targetPlayer ${gameEvent.data.targetPlayer} not found`;

    if (targetPlayer.coins < 1)
      throw `${targetPlayer.name} doesn't have enough coins to steal from`;
  }

  // validate balance for COUP
  if (gameEvent.data?.action === GameActionMove.COUP) {
    if (state.currentPlayer.coins < 7)
      throw `player ${gameEvent.user} needs at least 7 coins for action COUP`;
  }

  // validate balance for ASSASSINATE
  if (gameEvent.data?.action === GameActionMove.ASSASSINATE) {
    if (state.currentPlayer.coins < 3)
      throw `player ${gameEvent.user} needs at least 3 coins for action ASSASSINATE`;
  }

  state.currentAction = gameEvent.data;
  messageAllFn(gameEvent);
}
