import { getStrEnumVals } from "./getEnumVals";

export enum GameStatus {
  PRE_GAME = "Pre-Game",
  AWAITING_ACTION = "Awaiting Action",
  ACTION_SELECTED = "Action Selected",
  ACTION_BLOCKED = "Action Blocked",
  PLAYER_LOSING_CARD = "Player Losing Card",
  GAME_OVER = "Game Over",
  AWAITING_EXCHANGE = "Awaiting Exchange",
}

export enum GameEventType {
  PLAYER_JOIN_GAME = "Player Join Game",
  START_GAME = "Start Game",
  CHOOSE_ACTION = "Choose Action",
  CONFIRM_ACTION = "Confirm Action",
  CHALLENGE_ACTION = "Challenge Action",
  BLOCK_ACTION = "Block Action",
  ACCEPT_BLOCK = "Accept Block",
  CHALLENGE_BLOCK = "Challenge Block",
  PLAYER_LOSE_CARD = "Player Lose Card",
  PLAYER_REVEAL_CARD = "Player Reveal Card",
  PAUSE_GAME = "Pause Game",
  RESUME_GAME = "Resume Game",
  PLAYER_DISCONNECT = "Player Disconnected",
  CURRENT_STATE = "Current State",
  PLAYER_OUT = "Player Out",
  NEXT_TURN = "Next Turn",
  GAME_OVER = "Game Over",
  EXCHANGE_CARDS = "Exchange Cards",
  NEW_GAME = "New Game",
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

export type GameEventOrAction = GameEventType | GameActionMove;

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

export const AUTO_CONFIRMING_ACTIONS = [
  GameActionMove.INCOME,
  GameActionMove.COUP,
];

export const ALL_GAME_EVENT_TYPES =
  getStrEnumVals<GameEventType>(GameEventType);
