import { Card } from "./enums";

export type PlayerCard = {
  card: Card;
  isRevealed: boolean;
};

export class Player {
  private _cards: PlayerCard[] = [];
  name: string;
  coins: number;

  constructor(name: string, cards: Card[]) {
    if (!cards || cards.length !== 2) throw `player should start with 2 cards`;
    if (!name) throw `player must have a name`;

    this.name = name;
    this._cards = cards.map((card) => ({ card, isRevealed: false }));
    this.coins = 2;
  }

  get isOut() {
    return this._cards.map((x) => x.isRevealed).includes(false);
  }

  hasCard(card: Card): boolean {
    return this._cards.map((x) => x.card).includes(card);
  }

  revealCard(card: Card): void {
    const toReveal = this._cards.find((x) => x.card === card);

    if (!toReveal) throw `player does not have card ${card}`;

    toReveal.isRevealed = true;
  }

  replaceCardWith(cardToReplace: Card, newCard: Card): void {
    const toReplaceIndex = this._cards.findIndex(
      (x) => x.card === cardToReplace
    );

    if (toReplaceIndex === -1)
      throw `player does not have card ${cardToReplace}`;

    this._cards.splice(toReplaceIndex, 1);
    this._cards.push({ card: newCard, isRevealed: false });
  }
}
