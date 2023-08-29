import { Card } from "./Card";
import { GameActionMove } from "./enums";

export function getBlockActionAsCards(action: GameActionMove): Card[] {
  switch (action) {
    case GameActionMove.ASSASSINATE:
      return [Card.CONTESSA];
    case GameActionMove.FOREIGN_AID:
      return [Card.DUKE];
    case GameActionMove.STEAL:
      return [Card.CAPTAIN, Card.AMBASSADOR];
  }

  return [];
}
