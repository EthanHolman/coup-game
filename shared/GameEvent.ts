import { GameActionMove, GameEventType } from "./enums";
import { Card } from "./Card";
import { ClientGameState } from "./ClientGameState";

export type GameEventData = {
  targetPlayer?: string;
  action?: GameActionMove;
  card?: Card;

  // only used when sent by server
  reason?: string;
  playerNames?: string[];
  name?: string;
  state?: ClientGameState;
};

export type GameEvent = {
  event: GameEventType;
  user: string;
  data?: Partial<GameEventData>;
};
