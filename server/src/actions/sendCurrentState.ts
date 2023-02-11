import { Card } from "../../../shared/Card";
import { ClientGameState } from "../../../shared/ClientGameState";
import { GameEventType } from "../../../shared/enums";
import { GameState } from "../GameState";
import { messageAllFn } from "../messageFnTypes";
import { createServerEvent } from "../utils/createServerEvent";

export function sendCurrentState(state: GameState, messageAllFn: messageAllFn) {
  const clientState: ClientGameState = {
    currentPlayerName: state.currentPlayer.name,
    gameStatus: state.gameStatus,
    players: state.players.map((player) => ({
      name: player.name,
      coins: player.coins,
      isHost: player.isHost,
      isOut: player.isOut,
      cards: player.cards.map((card) =>
        card.isRevealed ? card.card : Card.HIDDEN_CARD
      ),
    })),
    deckCount: state.deck.count,
  };

  const event = createServerEvent(GameEventType.CURRENT_STATE, {
    state: clientState,
  });

  messageAllFn(event);
}
