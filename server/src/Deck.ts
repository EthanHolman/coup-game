import { Card } from "./enums";
import { getRandomNumber } from "./utils";

export class Deck {
  _deck: Card[];

  constructor(deck?: Card[]) {
    this._deck = deck ?? this._initDeck();
  }

  _initDeck(): Card[] {
    const numCardsOfType = 3;

    // first assemble a deck
    const unshuffledDeck: Card[] = [];
    for (let i = 0; i < numCardsOfType; i++) {
      // convert this to map
      for (const card in Object.keys(Card).filter(
        (key) => !isNaN(Number(Card[key as any]))
      ))
        unshuffledDeck.push(Card[Card[card] as any] as any);
    }

    // then shuffle it
    const shuffledDeck: Card[] = [];
    while (unshuffledDeck.length > 0) {
      const rand = getRandomNumber(0, unshuffledDeck.length - 1);
      shuffledDeck.push(unshuffledDeck.splice(rand, 1)[0]);
    }

    return shuffledDeck;
  }

  peekCard(position?: number): Card {
    if (!position) position = 0;

    return this._deck[position];
  }

  drawCard(position?: number): Card {
    if (!position) position = 0;

    return this._deck.splice(position, 1)[0];
  }

  discardCard(card: Card): void {
    // TODO: need to validate 'card'
    this._deck.push(card);
  }
}
