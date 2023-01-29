import { Card } from "../../../shared/Card";
import { GameActionMove } from "../../../shared/enums";

export function getRequiredCardForAction(action: GameActionMove): Card {
  switch (action) {
    case GameActionMove.STEAL:
      return Card.CAPTAIN;
    case GameActionMove.ASSASSINATE:
      return Card.ASSASSIN;
    case GameActionMove.TAX:
      return Card.DUKE;
    case GameActionMove.EXCHANGE:
      return Card.AMBASSADOR;
    default:
      throw `you don't need a card to perform ${action}`;
  }
}
