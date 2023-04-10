export enum ClientGameAction {
  ASSASSINATE,
  COUP,
  EXCHANGE,
  FOREIGN_AID,
  INCOME,
  STEAL,
  TAX,
  CONFIRM_ACTION,
  CHALLENGE_ACTION,
  BLOCK_ACTION,
  ACCEPT_BLOCK,
  CHALLENGE_BLOCK,
}

export function getFriendlyActionName(action: ClientGameAction) {
  switch (action) {
    case ClientGameAction.ASSASSINATE:
      return "Assassinate";
    case ClientGameAction.COUP:
      return "Coup";
    case ClientGameAction.EXCHANGE:
      return "Exchange";
    case ClientGameAction.FOREIGN_AID:
      return "Foreign Aid";
    case ClientGameAction.INCOME:
      return "Income";
    case ClientGameAction.STEAL:
      return "Steal";
    case ClientGameAction.TAX:
      return "Tax";
    case ClientGameAction.CONFIRM_ACTION:
      return "Confirm";
    case ClientGameAction.CHALLENGE_ACTION:
      return "Challenge";
    case ClientGameAction.BLOCK_ACTION:
      return "Block";
    case ClientGameAction.ACCEPT_BLOCK:
      return "Accept Block";
    case ClientGameAction.CHALLENGE_BLOCK:
      return "Challenge Block";
  }
}
