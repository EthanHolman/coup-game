import { GameEvent } from "../../../shared/GameEvent";
import { GameStatus } from "../../../shared/enums";
import { GameState } from "../GameState";
import { dispatchPlayerLoseCard } from "../actions/dispatchPlayerLoseCard";
import { givePlayerNewCard } from "../actions/givePlayerNewCard";
import { messageAllFn } from "../messageFnTypes";

export function challengeBlock(
  state: GameState,
  gameEvent: GameEvent,
  messageAllFn: messageAllFn
) {
  // validations
  if (state.getStatus() !== GameStatus.ACTION_BLOCKED)
    throw "challengeBlock only valid when status = ACTION_BLOCKED";

  if (state.blockAction!.user === gameEvent.user)
    throw "you cannot challenge your own block";

  const blockingPlayer = state.players.find(
    (x) => x.name === state.blockAction!.user
  );
  if (!blockingPlayer) throw `couldn't find player being blocked`;

  const card = state.blockAction!.data?.card;
  if (!card) throw "missing card";

  const blockActionUser = state.blockAction?.user!;
  state.clearBlockAction();

  if (blockingPlayer.hasCard(card)) {
    dispatchPlayerLoseCard(
      state,
      gameEvent.user,
      `${blockActionUser} has a ${card} card. You failed the challenge.`,
      messageAllFn
    );

    // block succeeds, so remove currentAction
    state.clearCurrentAction();

    // trigger blockEvent.user to get a new card
    givePlayerNewCard(state, blockingPlayer, card);
  } else {
    dispatchPlayerLoseCard(
      state,
      blockActionUser,
      "You were caught bluffing!",
      messageAllFn
    );
  }
}
