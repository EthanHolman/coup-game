import { getEnumVals } from "./getEnumVals";

export enum GameEventType {
  PLAYER_JOIN_GAME,
  START_GAME,
  CHOOSE_ACTION,
  CONFIRM_ACTION,
  CHALLENGE_ACTION,
  BLOCK_ACTION,
  ACCEPT_BLOCK,
  CHALLENGE_BLOCK,
  PLAYER_LOSE_CARD,
  PLAYER_REVEAL_CARD,
  WELCOME,
  PAUSE_GAME,
  RESUME_GAME,
  PLAYER_DISCONNECT,
  CURRENT_STATE,
}

export enum GameActionMove {
  NONE,
  INCOME,
  COUP,
  FOREIGN_AID,
  STEAL,
  ASSASSINATE,
  TAX,
  EXCHANGE,
  LOSE_CARD,
}

export const ALL_GAME_ACTION_MOVES =
  getEnumVals<GameActionMove>(GameActionMove);

export const ALL_PLAYABLE_GAME_ACTION_MOVES = ALL_GAME_ACTION_MOVES.filter(
  (x) => ![GameActionMove.NONE, GameActionMove.LOSE_CARD].includes(x)
);

export const ALL_GAME_EVENT_TYPES = getEnumVals<GameEventType>(GameEventType);
