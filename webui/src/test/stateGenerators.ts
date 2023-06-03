import { Card } from "../../../shared/Card";
import { ClientPlayer } from "../../../shared/ClientGameState";
import { GameStatus } from "../../../shared/enums";
import { ClientState } from "../ClientState";

export function generateClientState(
  numPlayers = 2,
  currentPlayer = 0,
  perspective = 0 // who to "generate state for"
): ClientState {
  if (currentPlayer >= numPlayers) throw "currentPlayer out of bounds";

  const players: ClientPlayer[] = [];

  for (let x = 0; x < numPlayers; x++) {
    const playerCards =
      perspective === x
        ? [Card.AMBASSADOR, Card.ASSASSIN]
        : [Card.HIDDEN_CARD, Card.HIDDEN_CARD];
    players.push({
      name: `player-${x}`,
      coins: 2,
      isHost: x === 0,
      isOut: false,
      cards: playerCards,
    });
  }

  return {
    username: players[perspective].name,
    thisPlayer: players[perspective],
    isMyTurn: players[currentPlayer].name === players[perspective].name,
    currentPlayerName: players[currentPlayer].name,
    isPaused: false,
    status: GameStatus.AWAITING_ACTION,
    currentAction: undefined,
    blockAction: undefined,
    players,
    deckCount: 15 - players.length * 2,
  };
}
