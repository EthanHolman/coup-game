import { Card } from "./Deck";
import { GameActionMove, GameEventType } from "./enums";

export type messagePlayerFn = (playerName: string, data: ServerEvent) => void;

export type messageAllFn = (data: ServerEvent) => void;

export type ServerEvent = {
  event: GameEventType;
  data?: any;
};

export type GameEventData = {
  targetPlayer?: string;
  action?: GameActionMove;
  card?: Card;
};

export type GameEvent = {
  event: GameEventType;
  user: string;
  data?: Partial<GameEventData>;
};
