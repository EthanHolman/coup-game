import { GameEvent } from "../../../shared/GameEvent";
import { GameStatus } from "../../../shared/enums";
import { GameState } from "../GameState";
import { dispatchPlayerLoseCard } from "../actions/dispatchPlayerLoseCard";
import { givePlayerNewCard } from "../actions/givePlayerNewCard";

export function challengeBlock(state: GameState, gameEvent: GameEvent) {
  // validations
  if (state.status !== GameStatus.ACTION_BLOCKED)
    throw "challengeBlock only valid when status = ACTION_BLOCKED";

  if (state.blockAction!.user === gameEvent.user)
    throw "you cannot challenge your own block";

  const blockingPlayer = state.players.find(
    (x) => x.name === state.blockAction!.user
  );
  if (!blockingPlayer) throw `couldn't find player being blocked`;

  const card = state.blockAction!.data?.card;
  if (!card) throw "missing card";

  if (blockingPlayer.hasCard(card)) {
    dispatchPlayerLoseCard(
      state,
      gameEvent.user,
      `${state.blockAction!.user} has a ${card} card. You failed the challenge.`
    );

    // block succeeds, so remove currentAction
    state.clearCurrentAction();

    // trigger blockEvent.user to get a new card
    givePlayerNewCard(state, blockingPlayer, card);
  } else {
    dispatchPlayerLoseCard(
      state,
      state.blockAction!.user,
      "You were caught bluffing!"
    );
  }
}
