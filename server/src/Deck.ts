import { ALL_CARDS, Card } from "../../shared/Card";
import { getRandomNumber } from "./utils/getRandomNumber";

// top of deck is index 0

export class Deck {
  _deck: Card[];

  constructor(deck?: Card[]) {
    this._deck = deck ?? this._initDeck();
  }

  _initDeck(): Card[] {
    const numCardsOfType = 3;

    // first assemble an unshuffled deck
    let unshuffledDeck: Card[] = [];
    for (let i = 0; i < numCardsOfType; i++) {
      unshuffledDeck = unshuffledDeck.concat(ALL_CARDS);
    }

    // then shuffle it by inserting each card
    //   in 'unshuffled' at a random position
    const shuffledDeck: Card[] = [];
    while (unshuffledDeck.length > 0) {
      const rand = getRandomNumber(0, unshuffledDeck.length - 1);
      shuffledDeck.push(unshuffledDeck.splice(rand, 1)[0]);
    }

    return shuffledDeck;
  }

  get count(): number {
    return this._deck.length;
  }

  peekCard(position: number = 0): Card {
    return this._deck[position];
  }

  drawCard(count: number = 1): Card[] {
    if (count < 1) throw `cannot draw less than 1 cards`;
    return this._deck.splice(0, count);
  }

  discardCard(card: Card): void {
    if (!ALL_CARDS.includes(card)) throw `value is not a valid card: ${card}`;
    this._deck.push(card);
  }
}
