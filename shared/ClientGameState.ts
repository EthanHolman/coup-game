import { Card } from "./Card";
import { GameEvent, GameEventData } from "./GameEvent";

export type ClientPlayer = {
  name: string;
  coins: number;
  isHost: boolean;
  isOut: boolean;
  cards: Card[];
};

export type ClientGameState = {
  currentPlayerName: string;
  gameStatus: "PRE_GAME" | "RUNNING" | "PAUSED";
  currentAction?: GameEventData;
  blockAction?: GameEvent;
  players: ClientPlayer[];
  deckCount: number;
};
