import { getStrEnumVals } from "./getEnumVals";

export enum GameStatus {
  PRE_GAME,
  AWAITING_ACTION,
  ACTION_SELECTED,
  ACTION_BLOCKED,
  PLAYER_LOSING_CARD,
  GAME_OVER,
}

export enum GameEventType {
  PLAYER_JOIN_GAME = "PLAYER_JOIN_GAME",
  START_GAME = "START_GAME",
  CHOOSE_ACTION = "CHOOSE_ACTION",
  CONFIRM_ACTION = "CONFIRM_ACTION",
  CHALLENGE_ACTION = "CHALLENGE_ACTION",
  BLOCK_ACTION = "BLOCK_ACTION",
  ACCEPT_BLOCK = "ACCEPT_BLOCK",
  CHALLENGE_BLOCK = "CHALLENGE_BLOCK",
  PLAYER_LOSE_CARD = "PLAYER_LOSE_CARD",
  PLAYER_REVEAL_CARD = "PLAYER_REVEAL_CARD",
  PAUSE_GAME = "PAUSE_GAME",
  RESUME_GAME = "RESUME_GAME",
  PLAYER_DISCONNECT = "PLAYER_DISCONNECT",
  CURRENT_STATE = "CURRENT_STATE",
  PLAYER_OUT = "PLAYER_OUT",
  NEXT_TURN = "NEXT_TURN",
  GAME_OVER = "GAME_OVER",
}

export enum GameActionMove {
  NONE = "NONE",
  INCOME = "Income",
  COUP = "Coup",
  FOREIGN_AID = "Foreign Aid",
  STEAL = "Steal",
  ASSASSINATE = "Assassinate",
  TAX = "Tax",
  EXCHANGE = "Exchange",
  LOSE_CARD = "Lose Card",
}

export const ALL_GAME_ACTION_MOVES = [
  GameActionMove.NONE,
  GameActionMove.INCOME,
  GameActionMove.COUP,
  GameActionMove.FOREIGN_AID,
  GameActionMove.STEAL,
  GameActionMove.ASSASSINATE,
  GameActionMove.TAX,
  GameActionMove.EXCHANGE,
  GameActionMove.LOSE_CARD,
];

export const ALL_PLAYABLE_GAME_ACTION_MOVES = ALL_GAME_ACTION_MOVES.filter(
  (x) => ![GameActionMove.NONE, GameActionMove.LOSE_CARD].includes(x)
);

export const CHALLENGEABLE_ACTIONS = [
  GameActionMove.ASSASSINATE,
  GameActionMove.EXCHANGE,
  GameActionMove.STEAL,
  GameActionMove.TAX,
];

export const BLOCKABLE_ACTIONS = [
  GameActionMove.ASSASSINATE,
  GameActionMove.FOREIGN_AID,
  GameActionMove.STEAL,
];

export const TARGETED_ACTIONS = [
  GameActionMove.COUP,
  GameActionMove.STEAL,
  GameActionMove.ASSASSINATE,
];

export const NON_TARGETED_ACTIONS = [
  GameActionMove.INCOME,
  GameActionMove.FOREIGN_AID,
  GameActionMove.TAX,
  GameActionMove.EXCHANGE,
];

export const ALL_GAME_EVENT_TYPES =
  getStrEnumVals<GameEventType>(GameEventType);
