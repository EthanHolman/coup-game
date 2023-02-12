import { Card } from "./Card";

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
  players: ClientPlayer[];
  deckCount: number;
};
