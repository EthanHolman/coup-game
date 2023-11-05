import { GameEvent } from "../../shared/GameEvent";

export type messagePlayerFn = (
  gameCode: string,
  user: string,
  data: GameEvent
) => void;

export type messageAllFn = (gameCode: string, data: GameEvent) => void;
