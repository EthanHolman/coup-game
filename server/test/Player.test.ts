import { assert } from "chai";
import { Card } from "../../shared/Card";
import { Player } from "../src/Player";

describe("player", function () {
  it("should be creatable with name and cards", function () {
    const cards = [Card.CONTESSA, Card.ASSASSIN];
    const player = new Player("Kody", cards);
    assert.equal(player.name, "Kody");
    assert.equal(player.cards.length, 2);
    assert.includeMembers(
      cards,
      player.cards.map((x) => x.card)
    );
  });

  it("should be given 2 coins to start with", function () {
    const player = new Player("Roger", [Card.DUKE, Card.DUKE]);
    assert.equal(player.coins, 2);
  });

  it("should be connected by default", function () {
    const player = new Player("someone", [Card.DUKE, Card.DUKE]);
    assert.isTrue(player.isConnected);
  });

  it("should not be creatable with LESS than 2 cards", function () {
    assert.throws(function () {
      new Player("someone", [Card.DUKE]);
    }, "should start with 2 cards");
  });

  it("should not be creatable with MORE than 2 cards", function () {
    assert.throws(function () {
      new Player("cheater", [
        Card.DUKE,
        Card.CONTESSA,
        Card.ASSASSIN,
        Card.CAPTAIN,
      ]);
    }, "should start with 2 cards");
  });

  it("should 'have' cards passed in during creation time", function () {
    const player = new Player("someone", [Card.CONTESSA, Card.ASSASSIN]);
    assert.isTrue(player.hasCard(Card.CONTESSA));
    assert.isTrue(player.hasCard(Card.ASSASSIN));
  });

  it("should not 'have' cards they dont have in their hand", function () {
    const player = new Player("someone", [Card.CONTESSA, Card.ASSASSIN]);
    assert.isFalse(player.hasCard(Card.DUKE));
    assert.isFalse(player.hasCard(Card.CAPTAIN));
  });

  it("should not have cards revealed by default", function () {
    const player = new Player("someone", [Card.CONTESSA, Card.ASSASSIN]);
    player.cards.forEach((card) => assert.isFalse(card.isRevealed));
  });

  it("should be able to reveal cards", function () {
    const player = new Player("someone", [Card.CONTESSA, Card.ASSASSIN]);
    player.revealCard(Card.ASSASSIN);
    assert.isTrue(
      player.cards.find((x) => x.card === Card.ASSASSIN)!.isRevealed
    );
    assert.isFalse(
      player.cards.find((x) => x.card === Card.CONTESSA)!.isRevealed
    );
  });

  it("should nolonger 'have' cards that are revealed", function () {
    const player = new Player("someone", [Card.CONTESSA, Card.ASSASSIN]);
    assert.isTrue(player.hasCard(Card.ASSASSIN));
    player.revealCard(Card.ASSASSIN);
    assert.isFalse(player.hasCard(Card.ASSASSIN));
    // should still 'have' cards that aren't revealed
    assert.isTrue(player.hasCard(Card.CONTESSA));
  });

  it("should still 'have' a card if they've got 2 of a kind and one is revealed", function () {
    const player = new Player("someone", [Card.CONTESSA, Card.CONTESSA]);
    player.revealCard(Card.CONTESSA);
    assert.isTrue(player.hasCard(Card.CONTESSA));
  });

  it("should not be 'out' when only one card is revealed", function () {
    const player = new Player("someone", [Card.CONTESSA, Card.ASSASSIN]);
    assert.isFalse(player.isOut);
    player.revealCard(Card.ASSASSIN);
    assert.isFalse(player.isOut);
  });

  it("should be 'out' when all cards are revealed", function () {
    const player1 = new Player("someone", [Card.CONTESSA, Card.ASSASSIN]);
    assert.isFalse(player1.isOut);
    player1.revealCard(Card.ASSASSIN);
    player1.revealCard(Card.CONTESSA);
    assert.isTrue(player1.isOut);

    const player2 = new Player("else", [Card.CONTESSA, Card.CONTESSA]);
    assert.isFalse(player2.isOut);
    player2.revealCard(Card.CONTESSA);
    player2.revealCard(Card.CONTESSA);
    assert.isTrue(player2.isOut);
  });

  it("should be able to replace a card with a different card", function () {
    const player = new Player("someone", [Card.CONTESSA, Card.ASSASSIN]);
    player.replaceCard(Card.ASSASSIN, Card.AMBASSADOR); // ah, the irony
    assert.isFalse(player.hasCard(Card.ASSASSIN));
    assert.isTrue(player.hasCard(Card.AMBASSADOR));
    // should still have the un-replaced card
    assert.isTrue(player.hasCard(Card.CONTESSA));
  });

  it("should not be able to replace cards that are revealed", function () {
    const player = new Player("someone", [Card.CONTESSA, Card.ASSASSIN]);
    player.revealCard(Card.CONTESSA);
    assert.throws(function () {
      player.replaceCard(Card.CONTESSA, Card.DUKE);
    });
    assert.isFalse(player.hasCard(Card.DUKE));
    assert.isFalse(player.hasCard(Card.CONTESSA));
    assert.isTrue(player.hasCard(Card.ASSASSIN));
  });

  it("should be able to replace card if they have 2 of a kind and one is revealed", function () {
    const player = new Player("someone", [Card.CONTESSA, Card.CONTESSA]);
    player.revealCard(Card.CONTESSA);
    player.replaceCard(Card.CONTESSA, Card.AMBASSADOR);
    assert.isTrue(player.hasCard(Card.AMBASSADOR));
    assert.isFalse(player.hasCard(Card.CONTESSA));
  });

  it("should not be able to reveal a card they dont have", function () {
    const player = new Player("someone", [Card.CONTESSA, Card.DUKE]);
    assert.throws(function () {
      player.revealCard(Card.CAPTAIN);
    }, "player does not have card");
    assert.isFalse(player.hasCard(Card.CAPTAIN));
    assert.isTrue(player.hasCard(Card.CONTESSA));
    assert.isTrue(player.hasCard(Card.DUKE));
  });

  it("should not be able to reveal a HIDDEN card", function () {
    const player = new Player("someone", [Card.CONTESSA, Card.DUKE]);
    assert.throws(function () {
      player.revealCard(Card.HIDDEN_CARD);
    }, `you can't reveal ${Card.HIDDEN_CARD}`);
  });

  it("should not allow replacing a card with something that isnt a card", function () {
    const player = new Player("haxor player", [Card.CONTESSA, Card.AMBASSADOR]);
    assert.throws(function () {
      const notACard: any = "i wanna break the game";
      player.replaceCard(Card.CONTESSA, notACard);
    });
    assert.isTrue(player.hasCard(Card.CONTESSA));
    assert.isTrue(player.hasCard(Card.AMBASSADOR));
  });

  it("should be able to be the host", function () {
    const player = new Player("ethan", [Card.AMBASSADOR, Card.ASSASSIN], true);
    assert.isTrue(player.isHost);
    player.isHost = false;
    assert.isFalse(player.isHost);
  });

  it("should be able to adjust coins up", function () {
    const player = new Player("alex", [Card.AMBASSADOR, Card.ASSASSIN]);
    assert.equal(player.coins, 2);
    player.updateCoins(1);
    assert.equal(player.coins, 3);
  });

  it("should be able to adjust coins down", function () {
    const player = new Player("alex", [Card.AMBASSADOR, Card.ASSASSIN]);
    assert.equal(player.coins, 2);
    player.updateCoins(-1);
    assert.equal(player.coins, 1);
  });

  it("should cap coin balance at 0 if adjustment down is too much", function () {
    const player = new Player("alex", [Card.AMBASSADOR, Card.ASSASSIN]);
    assert.equal(player.coins, 2);
    player.updateCoins(-10);
    assert.equal(player.coins, 0);
  });
});
