import { Card } from "./Card";

export type ClientPlayer = {
  name: string;
  coins: number;
  cards: Card[];
};

export type ClientGameState = {
  currentPlayerName: string;
  gameStatus: string;
  players: ClientPlayer[];
  deckCount: number;
};
