import { getEnumVals } from "./getEnumVals";

export enum Card {
  HIDDEN_CARD = -1,
  DUKE,
  AMBASSADOR,
  ASSASSIN,
  CONTESSA,
  CAPTAIN,
}

export const ALL_CARDS = getEnumVals<Card>(Card).filter(
  (x) => x !== Card.HIDDEN_CARD
);
