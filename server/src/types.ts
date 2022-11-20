import { GameEventType } from "./enums";

export type messagePlayerFn = (playerName: string, data: any) => void;

export type messageAllFn = (data: any) => void;

export type ServerEvent = {
  event: GameEventType;
};

export type GameEvent = {
  event: GameEventType;
  user: string;
  data: any;
};
