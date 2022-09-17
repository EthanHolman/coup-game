export enum Card {
  DUKE,
  AMBASSADOR,
  ASSASSIN,
  CONTESSA,
  CAPTAIN,
}

export enum GameEventType {
  PLAYER_JOIN_GAME,
  START_GAME,
  PROPOSE_ACTION,
  CONFIRM_ACTION,
  NEVERMIND_ACTION,
  CALL_BS,
  BLOCK_ACTION,
  PLAYER_LOSE_CARD,
  PLAYER_REVEAL_CARD,
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
}
