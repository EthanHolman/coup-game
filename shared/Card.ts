import { getEnumVals } from "./getEnumVals";

export enum Card {
  DUKE,
  AMBASSADOR,
  ASSASSIN,
  CONTESSA,
  CAPTAIN,
}

export const ALL_CARDS = getEnumVals<Card>(Card);
