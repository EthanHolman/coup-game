import { assert } from "chai";
import { ALL_CARDS, Card, Deck } from "../src/Deck";

describe("deck", function () {
  it("should generate deck if one is not passed in", function () {
    const numCards = 15;

    const deck = new Deck();
    assert.equal(deck._deck.length, numCards);

    for (let x = 0; x < numCards; x++) {
      assert.include(ALL_CARDS, deck._deck[x]);
    }
  });

  it("should have correct number of each cards when generating", function () {
    const expectedDeckCards: Card[] = [];
    ALL_CARDS.forEach((card) => {
      for (let i = 0; i < 3; i++) expectedDeckCards.push(card);
    });
    expectedDeckCards.sort();

    const deck = new Deck();
    const actualDeckCards = deck._deck;
    actualDeckCards.sort();

    for (let i = 0; i < expectedDeckCards.length; i++)
      assert.equal(expectedDeckCards[i], actualDeckCards[i]);
  });

  it("should allow peeking at a card", function () {
    const deck = new Deck();
    const originalLength = deck._deck.length;

    const card = deck.peekCard();

    assert.include(ALL_CARDS, card);
    assert.equal(deck._deck[0], card);
    assert.equal(originalLength, deck._deck.length);
  });

  it("should allow drawing a card from top of deck", function () {
    const deck = new Deck([Card.AMBASSADOR, Card.ASSASSIN, Card.CAPTAIN]);

    const card = deck.drawCard()[0];

    assert.equal(card, Card.AMBASSADOR);
    assert.equal(deck._deck[0], Card.ASSASSIN);
    assert.lengthOf(deck._deck, 2);
  });

  it("should allow drawing multiple cards", function () {
    const deck = new Deck([Card.AMBASSADOR, Card.ASSASSIN, Card.CAPTAIN]);

    const card = deck.drawCard(2);

    assert.equal(card[0], Card.AMBASSADOR);
    assert.equal(card[1], Card.ASSASSIN);
    assert.equal(deck._deck[0], Card.CAPTAIN);
    assert.lengthOf(deck._deck, 1);
  });

  it("should not allow drawing less than 1 cards", function () {
    const deck = new Deck();
    assert.throws(function () {
      deck.drawCard(0);
    });
    assert.throws(function () {
      deck.drawCard(-1);
    });
  });

  it("should discard a card to the bottom/end of deck", function () {
    const deck = new Deck([Card.AMBASSADOR, Card.ASSASSIN]);
    const toDiscard = Card.CONTESSA;

    deck.discardCard(toDiscard);

    assert.lengthOf(deck._deck, 3);
    assert.equal(deck._deck[0], Card.AMBASSADOR);
    assert.equal(deck._deck[1], Card.ASSASSIN);
    assert.equal(deck._deck[2], Card.CONTESSA);
  });

  it("should not allow discarding something that isnt a 'card'", function () {
    const deck = new Deck();
    const toDiscard: any = "not_a_card";

    assert.throws(function () {
      deck.discardCard(toDiscard);
    });
  });
});
