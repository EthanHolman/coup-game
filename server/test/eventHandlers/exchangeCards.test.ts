import { assert } from "chai";
import Sinon from "sinon";
import { Card } from "../../../shared/Card";
import { GameEvent } from "../../../shared/GameEvent";
import {
  GameActionMove,
  GameEventType,
  GameStatus,
} from "../../../shared/enums";
import { GameState } from "../../src/GameState";
import { Player } from "../../src/Player";
import { exchangeCards } from "../../src/eventHandlers/exchangeCards";
import * as module_nextTurn from "../../src/actions/nextTurn";

describe("exchangeCards event handler", function () {
  let mock_nextTurn: Sinon.SinonStub;

  this.beforeEach(function () {
    mock_nextTurn = Sinon.stub(module_nextTurn, "nextTurn").returns();
  });

  this.afterEach(function () {
    mock_nextTurn.restore();
  });

  it("should not allow if number of cards to exchange doesnt match currentplayer's unrevealed cards count", function () {
    const state = new GameState();
    const tester0 = new Player("tester-0", [Card.AMBASSADOR, Card.ASSASSIN]);
    tester0.revealCard(Card.ASSASSIN);
    state.addPlayer(tester0);
    state.addPlayer(new Player("tester-1", [Card.AMBASSADOR, Card.ASSASSIN]));
    state.start();
    state.currentAction = { action: GameActionMove.EXCHANGE };
    state.exchangeCards = [Card.DUKE, Card.CONTESSA];
    const event: GameEvent = {
      event: GameEventType.EXCHANGE_CARDS,
      user: "tester-0",
      data: { exchangeKeeping: [Card.AMBASSADOR, Card.CONTESSA] },
    };
    assert.throws(function () {
      exchangeCards(state, event, Sinon.stub());
    }, "invalid number of cards");
  });

  it("should not allow exchangeKeeping cards that aren't in players hand or exchangeCards", function () {
    const state = new GameState();
    state.addPlayer(new Player("tester-0", [Card.AMBASSADOR, Card.ASSASSIN]));
    state.addPlayer(new Player("tester-1", [Card.AMBASSADOR, Card.ASSASSIN]));
    state.start();
    state.currentAction = { action: GameActionMove.EXCHANGE };
    state.exchangeCards = [Card.DUKE, Card.CONTESSA];
    const event: GameEvent = {
      event: GameEventType.EXCHANGE_CARDS,
      user: "tester-0",
      data: { exchangeKeeping: [Card.AMBASSADOR, Card.CAPTAIN] },
    };
    assert.throws(function () {
      exchangeCards(state, event, Sinon.stub());
    }, "is not in player's hand");
  });

  it("should exchange 2 cards for different ones", function () {
    const state = new GameState();
    const player0 = new Player("tester-0", [Card.AMBASSADOR, Card.ASSASSIN]);
    state.addPlayer(player0);
    const player1 = new Player("tester-1", [Card.AMBASSADOR, Card.ASSASSIN]);
    state.addPlayer(player1);
    state.start();
    state.currentAction = { action: GameActionMove.EXCHANGE };
    state.exchangeCards = [Card.DUKE, Card.CONTESSA];
    const event: GameEvent = {
      event: GameEventType.EXCHANGE_CARDS,
      user: "tester-0",
      data: { exchangeKeeping: [Card.DUKE, Card.CONTESSA] },
    };

    exchangeCards(state, event, Sinon.stub());

    assert.sameMembers(
      player0.cards.map((x) => x.card),
      [Card.DUKE, Card.CONTESSA]
    );
    const discarded = [
      state.deck.peekCard(state.deck.count - 1),
      state.deck.peekCard(state.deck.count - 2),
    ];
    assert.sameMembers(discarded, [Card.AMBASSADOR, Card.ASSASSIN]);
  });

  it("should exchange 2 cards for the same ones", function () {
    const state = new GameState();
    const player0 = new Player("tester-0", [Card.AMBASSADOR, Card.ASSASSIN]);
    state.addPlayer(player0);
    const player1 = new Player("tester-1", [Card.AMBASSADOR, Card.ASSASSIN]);
    state.addPlayer(player1);
    state.start();
    state.currentAction = { action: GameActionMove.EXCHANGE };
    state.exchangeCards = [Card.DUKE, Card.CONTESSA];
    const event: GameEvent = {
      event: GameEventType.EXCHANGE_CARDS,
      user: "tester-0",
      data: { exchangeKeeping: [Card.ASSASSIN, Card.AMBASSADOR] },
    };

    exchangeCards(state, event, Sinon.stub());

    assert.sameMembers(
      player0.cards.map((x) => x.card),
      [Card.AMBASSADOR, Card.ASSASSIN]
    );
    const discarded = [
      state.deck.peekCard(state.deck.count - 1),
      state.deck.peekCard(state.deck.count - 2),
    ];
    assert.sameMembers(discarded, [Card.CONTESSA, Card.DUKE]);
  });

  it("should exchange 2 cards for the same ones, cards are same", function () {
    const state = new GameState();
    const player0 = new Player("tester-0", [Card.AMBASSADOR, Card.AMBASSADOR]);
    state.addPlayer(player0);
    const player1 = new Player("tester-1", [Card.AMBASSADOR, Card.ASSASSIN]);
    state.addPlayer(player1);
    state.start();
    state.currentAction = { action: GameActionMove.EXCHANGE };
    state.exchangeCards = [Card.DUKE, Card.AMBASSADOR];
    const event: GameEvent = {
      event: GameEventType.EXCHANGE_CARDS,
      user: "tester-0",
      data: { exchangeKeeping: [Card.AMBASSADOR, Card.AMBASSADOR] },
    };

    exchangeCards(state, event, Sinon.stub());

    assert.sameMembers(
      player0.cards.map((x) => x.card),
      [Card.AMBASSADOR, Card.AMBASSADOR]
    );
    const discarded = [
      state.deck.peekCard(state.deck.count - 1),
      state.deck.peekCard(state.deck.count - 2),
    ];
    assert.sameMembers(discarded, [Card.AMBASSADOR, Card.DUKE]);
  });

  it("should exchange 2 cards for one the same, one different", function () {
    const state = new GameState();
    const player0 = new Player("tester-0", [Card.AMBASSADOR, Card.ASSASSIN]);
    state.addPlayer(player0);
    const player1 = new Player("tester-1", [Card.AMBASSADOR, Card.ASSASSIN]);
    state.addPlayer(player1);
    state.start();
    state.currentAction = { action: GameActionMove.EXCHANGE };
    state.exchangeCards = [Card.DUKE, Card.CONTESSA];
    const event: GameEvent = {
      event: GameEventType.EXCHANGE_CARDS,
      user: "tester-0",
      data: { exchangeKeeping: [Card.ASSASSIN, Card.CONTESSA] },
    };

    exchangeCards(state, event, Sinon.stub());

    assert.sameMembers(
      player0.cards.map((x) => x.card),
      [Card.CONTESSA, Card.ASSASSIN]
    );
    assert.sameMembers(player0.unrevealedCards as any, [
      Card.CONTESSA,
      Card.ASSASSIN,
    ]);
    const discarded = [
      state.deck.peekCard(state.deck.count - 1),
      state.deck.peekCard(state.deck.count - 2),
    ];
    assert.sameMembers(discarded, [Card.AMBASSADOR, Card.DUKE]);
  });

  it("should exchange card for the same one (player has one revealed)", function () {
    const state = new GameState();
    const player0 = new Player("tester-0", [Card.AMBASSADOR, Card.ASSASSIN]);
    player0.revealCard(Card.AMBASSADOR);
    state.addPlayer(player0);
    const player1 = new Player("tester-1", [Card.AMBASSADOR, Card.ASSASSIN]);
    state.addPlayer(player1);
    state.start();
    state.currentAction = { action: GameActionMove.EXCHANGE };
    state.exchangeCards = [Card.DUKE, Card.CONTESSA];
    const event: GameEvent = {
      event: GameEventType.EXCHANGE_CARDS,
      user: "tester-0",
      data: { exchangeKeeping: [Card.ASSASSIN] },
    };

    exchangeCards(state, event, Sinon.stub());

    assert.lengthOf(player0.cards, 2);
    assert.sameMembers(player0.unrevealedCards as any, [Card.ASSASSIN]);
    const discarded = [
      state.deck.peekCard(state.deck.count - 1),
      state.deck.peekCard(state.deck.count - 2),
    ];
    assert.sameMembers(discarded, [Card.CONTESSA, Card.DUKE]);
  });

  it("should exchange card for a different one (player has one revealed)", function () {
    const state = new GameState();
    const player0 = new Player("tester-0", [Card.AMBASSADOR, Card.ASSASSIN]);
    player0.revealCard(Card.AMBASSADOR);
    state.addPlayer(player0);
    const player1 = new Player("tester-1", [Card.AMBASSADOR, Card.ASSASSIN]);
    state.addPlayer(player1);
    state.start();
    state.currentAction = { action: GameActionMove.EXCHANGE };
    state.exchangeCards = [Card.DUKE, Card.CONTESSA];
    const event: GameEvent = {
      event: GameEventType.EXCHANGE_CARDS,
      user: "tester-0",
      data: { exchangeKeeping: [Card.DUKE] },
    };

    exchangeCards(state, event, Sinon.stub());

    assert.lengthOf(player0.cards, 2);
    assert.sameMembers(player0.unrevealedCards as any, [Card.DUKE]);
    const discarded = [
      state.deck.peekCard(state.deck.count - 1),
      state.deck.peekCard(state.deck.count - 2),
    ];
    assert.sameMembers(discarded, [Card.CONTESSA, Card.ASSASSIN]);
  });

  it("should clear state.exchangeCards after success", function () {
    const state = new GameState();
    state.addPlayer(new Player("tester-0", [Card.AMBASSADOR, Card.ASSASSIN]));
    state.addPlayer(new Player("tester-1", [Card.AMBASSADOR, Card.ASSASSIN]));
    state.start();
    state.currentAction = { action: GameActionMove.EXCHANGE };
    state.exchangeCards = [Card.DUKE, Card.CONTESSA];
    const event: GameEvent = {
      event: GameEventType.EXCHANGE_CARDS,
      user: "tester-0",
      data: { exchangeKeeping: [Card.AMBASSADOR, Card.DUKE] },
    };

    exchangeCards(state, event, Sinon.stub());

    assert.isUndefined(state.exchangeCards);
    assert.notStrictEqual(state.getStatus(), GameStatus.AWAITING_EXCHANGE);
  });

  it("should trigger nextTurn after success", function () {
    const state = new GameState();
    state.addPlayer(new Player("tester-0", [Card.AMBASSADOR, Card.ASSASSIN]));
    state.addPlayer(new Player("tester-1", [Card.AMBASSADOR, Card.ASSASSIN]));
    state.start();
    state.currentAction = { action: GameActionMove.EXCHANGE };
    state.exchangeCards = [Card.DUKE, Card.CONTESSA];
    const event: GameEvent = {
      event: GameEventType.EXCHANGE_CARDS,
      user: "tester-0",
      data: { exchangeKeeping: [Card.AMBASSADOR, Card.DUKE] },
    };

    exchangeCards(state, event, Sinon.stub());

    Sinon.assert.calledOnce(mock_nextTurn);
  });
});
