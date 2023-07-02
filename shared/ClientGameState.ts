import { Card } from "./Card";
import { GameEvent, GameEventData } from "./GameEvent";
import { PlayerCard } from "./PlayerCard";
import { GameStatus } from "./enums";
import { PlayerLoseCardAction } from "./types";

export type ClientPlayer = {
  name: string;
  coins: number;
  isHost: boolean;
  isOut: boolean;
  cards: PlayerCard[];
};

export type ClientGameState = {
  currentPlayerName: string;
  isPaused: boolean;
  status: GameStatus;
  currentAction?: GameEventData;
  blockAction?: GameEvent;
  playerLosingCard?: PlayerLoseCardAction;
  exchangeCards?: Card[];
  players: ClientPlayer[];
  deckCount: number;
};
