import { GameEventType } from "./enums";

export type messagePlayerFn = (playerName: string, data: any) => void;

export type messageAllFn = (data: ServerEvent) => void;

export type ServerEvent = {
  event: GameEventType;
  data?: any;
};

export type GameEvent = {
  event: GameEventType;
  user: string;
  data?: any;
};
