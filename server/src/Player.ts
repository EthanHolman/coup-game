import { ALL_CARDS, Card } from "../../shared/Card";
import { PlayerCard } from "../../shared/PlayerCard";

export class Player {
  private _cards: PlayerCard[] = [];
  name: string;
  coins: number;
  isConnected: boolean;
  isHost: boolean;

  constructor(name: string, cards: Card[], isHost?: boolean) {
    if (!cards || cards.length !== 2) throw `player should start with 2 cards`;
    if (!name) throw `player must have a name`;

    this.name = name;
    this._cards = cards.map((card) => ({ card, isRevealed: false }));
    this.coins = 2;
    this.isConnected = true;
    this.isHost = isHost ?? false;
  }

  get cards(): ReadonlyArray<PlayerCard> {
    return this._cards;
  }

  get unrevealedCards(): ReadonlyArray<Card> {
    return this._cards.filter((x) => !x.isRevealed).map((x) => x.card);
  }

  get isOut() {
    return this._cards.every((x) => x.isRevealed === true);
  }

  hasCard(card: Card): boolean {
    return this._cards
      .filter((x) => !x.isRevealed)
      .map((y) => y.card)
      .includes(card);
  }

  revealCard(card: Card): void {
    if (card === Card.HIDDEN_CARD) throw `you can't reveal ${card}`;
    const toReveal = this._cards.find((x) => x.card === card && !x.isRevealed);

    if (!toReveal) throw `player does not have card ${card}`;

    toReveal.isRevealed = true;
  }

  replaceCard(cardToReplace: Card, newCard: Card): void {
    if (!ALL_CARDS.includes(newCard))
      throw `newCard is not a valid card: ${newCard}`;

    const toReplaceIndex = this._cards.findIndex(
      (x) => x.card === cardToReplace && !x.isRevealed
    );

    if (toReplaceIndex === -1)
      throw `player does not have card ${cardToReplace}`;

    this._cards.splice(toReplaceIndex, 1);
    this._cards.push({ card: newCard, isRevealed: false });
  }

  updateCoins(adjustmentAmount: number): void {
    this.coins += adjustmentAmount;
    if (this.coins < 0) this.coins = 0;
  }
}
