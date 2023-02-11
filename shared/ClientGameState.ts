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
  gameStatus: string;
  players: ClientPlayer[];
  deckCount: number;
};
