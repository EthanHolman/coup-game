import { Card } from "../../../shared/Card";
import { ClientGameState } from "../../../shared/ClientGameState";
import { GameState } from "../GameState";

export function buildClientState(
  state: GameState,
  forPlayerName: string
): ClientGameState {
  if (!state.players.find((x) => x.name === forPlayerName))
    throw `could not find player ${forPlayerName} in gamestate`;

  return {
    currentPlayerName: state.currentPlayer.name,
    isPaused: state.isPaused,
    status: state.status,
    currentAction: state.currentAction,
    blockAction: state.blockAction,
    players: state.players.map((player) => ({
      name: player.name,
      coins: player.coins,
      isHost: player.isHost,
      isOut: player.isOut,
      cards: player.cards.map((card) =>
        card.isRevealed || player.name === forPlayerName
          ? card
          : { ...card, card: Card.HIDDEN_CARD }
      ),
    })),
    deckCount: state.deck.count,
  };
}
