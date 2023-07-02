import { GameEvent } from "../../../shared/GameEvent";
import { GameStatus } from "../../../shared/enums";
import { GameState } from "../GameState";
import { nextTurn } from "../actions/nextTurn";
import { messageAllFn } from "../messageFnTypes";

export function exchangeCards(
  state: GameState,
  gameEvent: GameEvent,
  messageAllFn: messageAllFn
) {
  if (state.getStatus() !== GameStatus.AWAITING_EXCHANGE)
    throw "exchangeCards only valid when status = AWAITING_EXCHANGE";

  if (gameEvent.user !== state.currentPlayer.name)
    throw `wrong user, only ${state.currentPlayer.name} can exchange cards`;

  const { exchangeKeeping } = gameEvent.data!;
  if (!exchangeKeeping) throw "missing cards to keep from exchange";

  const { unrevealedCards } = state.currentPlayer;

  if (unrevealedCards.length !== exchangeKeeping.length)
    throw `invalid number of cards, expecting ${unrevealedCards.length}`;

  const poolOfCards = [...unrevealedCards, ...state.exchangeCards!];

  exchangeKeeping.forEach((card) => {
    if (!poolOfCards.includes(card))
      throw `${card} is not in player's hand or exchange cards`;
  });

  for (let i = 0; i < unrevealedCards.length; i++) {
    state.currentPlayer.replaceCard(unrevealedCards[i], exchangeKeeping[i]);
    poolOfCards.splice(
      poolOfCards.findIndex((x) => x === exchangeKeeping[i]),
      1
    );
  }

  poolOfCards.forEach((card) => state.deck.discardCard(card));

  state.exchangeCards = undefined;

  nextTurn(state, messageAllFn);
}
