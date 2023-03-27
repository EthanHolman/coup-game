import { assert } from "chai";
import { Card } from "../../../shared/Card";
import { GameState } from "../../src/GameState";
import { Player } from "../../src/Player";
import { buildClientState } from "../../src/utils/buildClientState";
import { generateStateWithNPlayers } from "../testHelpers/stateGenerators";

describe("util buildClientState", function () {
  it("should map correct currentPlayer", function () {
    const state = generateStateWithNPlayers(2);
    const result = buildClientState(state, "tester-1");
    assert.equal(result.currentPlayerName, "tester-0");
  });

  it("should map correct game status", function () {
    const state = generateStateWithNPlayers(2);
    assert.equal(state.gameStatus, "RUNNING");
    const result = buildClientState(state, "tester-1");
    assert.equal(result.gameStatus, "RUNNING");
  });

  it("should map deck count correctly", function () {
    const state = generateStateWithNPlayers(2);
    state.deck.drawCard(1);
    assert.equal(state.deck.count, 14);
    const result = buildClientState(state, "tester-1");
    assert.equal(result.deckCount, 14);
  });

  it("should map players correctly", function () {
    const state = new GameState();
    const p0 = new Player("tester-0", [Card.CONTESSA, Card.AMBASSADOR], false);
    state.addPlayer(p0);

    const p1 = new Player("tester-1", [Card.CONTESSA, Card.AMBASSADOR], false);
    p1.revealCard(Card.AMBASSADOR);
    p1.coins = 0;
    state.addPlayer(p1);

    const p2 = new Player("tester-2", [Card.DUKE, Card.CAPTAIN], false);
    p2.revealCard(Card.DUKE);
    p2.revealCard(Card.CAPTAIN);
    p2.coins = 7;
    p2.isHost = true;
    state.addPlayer(p2);

    const p3 = new Player("tester-3", [Card.ASSASSIN, Card.ASSASSIN], false);
    state.addPlayer(p3);

    const { players } = buildClientState(state, "tester-3");

    assert.lengthOf(players, 4);

    const player0 = players.find((x) => x.name === "tester-0")!;
    assert.equal(player0.coins, 2);
    assert.isFalse(player0.isHost);
    assert.isFalse(player0.isOut);
    assert.sameMembers(player0.cards, [Card.HIDDEN_CARD, Card.HIDDEN_CARD]);

    const player1 = players.find((x) => x.name === "tester-1")!;
    assert.equal(player1.coins, 0);
    assert.isFalse(player1.isHost);
    assert.isFalse(player1.isOut);
    assert.sameMembers(player1.cards, [Card.HIDDEN_CARD, Card.AMBASSADOR]);

    const player2 = players.find((x) => x.name === "tester-2")!;
    assert.equal(player2.coins, 7);
    assert.isTrue(player2.isHost);
    assert.isTrue(player2.isOut);
    assert.sameMembers(player2.cards, [Card.DUKE, Card.CAPTAIN]);
  });

  it("should not hide cards for the player we build state for", function () {
    const state = new GameState();
    const p0 = new Player("tester-0", [Card.CONTESSA, Card.AMBASSADOR], false);
    state.addPlayer(p0);
    const p1 = new Player("tester-1", [Card.ASSASSIN, Card.CAPTAIN], false);
    state.addPlayer(p1);

    const { players } = buildClientState(state, "tester-1");

    const player0 = players.find((x) => x.name === "tester-0")!;
    assert.sameMembers(player0.cards, [Card.HIDDEN_CARD, Card.HIDDEN_CARD]);
    const player1 = players.find((x) => x.name === "tester-1")!;
    assert.sameMembers(player1.cards, [Card.ASSASSIN, Card.CAPTAIN]);
  });
});
