import { GameEvent } from "../../shared/GameEvent";

export type messagePlayerFn = (playerName: string, data: GameEvent) => void;

export type messageAllFn = (data: GameEvent) => void;
