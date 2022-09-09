import { Card } from "./enums";

export type Player = {
  name: string;
  cards: Card[];
  coins: number;
};
