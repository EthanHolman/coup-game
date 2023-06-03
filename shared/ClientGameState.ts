import { GameStatus } from "../server/src/GameState";
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
  isPaused: boolean;
  status: GameStatus;
  currentAction?: GameEventData;
  blockAction?: GameEvent;
  players: ClientPlayer[];
  deckCount: number;
};
