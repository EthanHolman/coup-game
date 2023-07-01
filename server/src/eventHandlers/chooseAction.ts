import {
  ALL_PLAYABLE_GAME_ACTION_MOVES,
  GameActionMove,
  GameStatus,
  TARGETED_ACTIONS,
} from "../../../shared/enums";
import { GameState } from "../GameState";
import { messageAllFn } from "../messageFnTypes";
import { GameEvent } from "../../../shared/GameEvent";

function validateChooseAction(state: GameState, gameEvent: GameEvent) {
  if (state.getStatus() !== GameStatus.AWAITING_ACTION)
    throw "chooseAction only valid when status = AWAITING_ACTION";

  if (gameEvent.user !== state.currentPlayer.name)
    throw `it is not currently ${gameEvent.user}'s turn`;

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
  if (TARGETED_ACTIONS.includes(gameEvent.data?.action!)) {
    if (!gameEvent.data?.targetPlayer) throw "missing targetPlayer";

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
}

export function chooseAction(
  state: GameState,
  gameEvent: GameEvent,
  messageAllFn: messageAllFn
) {
  validateChooseAction(state, gameEvent);

  if (gameEvent.data?.action === GameActionMove.COUP)
    state.currentPlayer.updateCoins(-7);

  if (gameEvent.data?.action === GameActionMove.ASSASSINATE)
    state.currentPlayer.updateCoins(-3);

  state.currentAction = gameEvent.data;
  messageAllFn(gameEvent);
}
