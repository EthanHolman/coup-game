import { getStrEnumVals } from "./getEnumVals";

export enum Card {
  HIDDEN_CARD = "HIDDEN_CARD",
  DUKE = "Duke",
  AMBASSADOR = "Ambassador",
  ASSASSIN = "Assassin",
  CONTESSA = "Contessa",
  CAPTAIN = "Captain",
}

export const ALL_CARDS = getStrEnumVals<Card>(Card).filter(
  (x) => x !== Card.HIDDEN_CARD
);
