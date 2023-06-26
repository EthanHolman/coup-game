import { GameState } from "../GameState";
import { GameEvent } from "../../../shared/GameEvent";
import {
  GameActionMove,
  GameEventType,
  GameStatus,
} from "../../../shared/enums";
import { messageAllFn } from "../messageFnTypes";
import { createServerEvent } from "../utils/createServerEvent";

export function playerRevealCard(
  state: GameState,
  gameEvent: GameEvent,
  messageAllFn: messageAllFn
) {
  if (state.getStatus() !== GameStatus.PLAYER_LOSING_CARD)
    throw "playerRevealCard only valid when status = PLAYER_LOSING_CARD";
  if (state.playerLosingCard?.player !== gameEvent.user) throw "wrong user!";
  if (!gameEvent.data || !gameEvent.data.card) throw "missing card to lose";

  const player = state.players.find(
    (x) => x.name === state.playerLosingCard?.player
  );
  if (!player) throw `unable to find player ${state.playerLosingCard.player}`;

  player.revealCard(gameEvent.data.card);

  state.playerLosingCard = undefined;

  messageAllFn(gameEvent);

  if (player.isOut) {
    messageAllFn(
      createServerEvent(GameEventType.PLAYER_OUT, { name: player.name })
    );

    // clear current action if it will force this player to reveal another card
    if (
      state.currentAction &&
      state.currentAction?.targetPlayer === player.name &&
      [GameActionMove.COUP, GameActionMove.ASSASSINATE].includes(
        state.currentAction?.action!
      )
    )
      state.clearCurrentAction();

    // check for game over state
    if (state.getStatus() === GameStatus.GAME_OVER) {
      const lastRemainingPlayer = state.players.find((x) => !x.isOut);
      if (!lastRemainingPlayer)
        throw "unable to find the last remaining player";
      messageAllFn(
        createServerEvent(GameEventType.GAME_OVER, {
          name: lastRemainingPlayer.name,
        })
      );
    }
  }
}
