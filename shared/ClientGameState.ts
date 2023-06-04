import { GameEvent, GameEventData } from "./GameEvent";
import { PlayerCard } from "./PlayerCard";
import { GameStatus } from "./enums";

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
  players: ClientPlayer[];
  deckCount: number;
};
