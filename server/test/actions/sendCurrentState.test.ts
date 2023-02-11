import { assert } from "chai";
import Sinon from "sinon";
import { Card } from "../../../shared/Card";
import { ClientPlayer } from "../../../shared/ClientGameState";
import { sendCurrentState } from "../../src/actions/sendCurrentState";
import { GameState } from "../../src/GameState";
import { Player } from "../../src/Player";
import { generateStateWithNPlayers } from "../testHelpers/stateGenerators";

describe("action sendCurrentState", function () {
  it("should map correct currentPlayer", function () {
    const state = generateStateWithNPlayers(2);
    const mockMessageAllFn = Sinon.stub();

    sendCurrentState(state, mockMessageAllFn);

    Sinon.assert.calledOnce(mockMessageAllFn);
    const event = mockMessageAllFn.getCall(0).args[0];
    assert.equal(event.data.state.currentPlayerName, "tester-0");
  });

  it("should map correct game status", function () {
    const state = generateStateWithNPlayers(2);
    assert.equal(state.gameStatus, "RUNNING");
    const mockMessageAllFn = Sinon.stub();

    sendCurrentState(state, mockMessageAllFn);

    Sinon.assert.calledOnce(mockMessageAllFn);
    const event = mockMessageAllFn.getCall(0).args[0];
    assert.equal(event.data.state.gameStatus, "RUNNING");
  });

  it("should map deck count correctly", function () {
    const state = generateStateWithNPlayers(2);
    assert.equal(state.deck.count, 15);
    state.deck.drawCard(1);
    assert.equal(state.deck.count, 14);
    const mockMessageAllFn = Sinon.stub();

    sendCurrentState(state, mockMessageAllFn);

    Sinon.assert.calledOnce(mockMessageAllFn);
    const event = mockMessageAllFn.getCall(0).args[0];
    assert.equal(event.data.state.deckCount, 14);
  });

  it("should map players correctly", function () {
    const state = new GameState();
    state.addPlayer(
      new Player("tester-0", [Card.CONTESSA, Card.AMBASSADOR], false)
    );
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
    const mockMessageAllFn = Sinon.stub();

    sendCurrentState(state, mockMessageAllFn);

    Sinon.assert.calledOnce(mockMessageAllFn);
    const event = mockMessageAllFn.getCall(0).args[0];
    const players = event.data.state.players as ClientPlayer[];

    assert.lengthOf(players, 3);
    const player0 = players.find((x) => x.name === "tester-0") as ClientPlayer;
    assert.equal(player0.coins, 2);
    assert.isFalse(player0.isHost);
    assert.isFalse(player0.isOut);
    assert.sameMembers(player0.cards, [Card.HIDDEN_CARD, Card.HIDDEN_CARD]);

    const player1 = players.find((x) => x.name === "tester-1") as ClientPlayer;
    assert.equal(player1.coins, 0);
    assert.isFalse(player1.isHost);
    assert.isFalse(player1.isOut);
    assert.sameMembers(player1.cards, [Card.HIDDEN_CARD, Card.AMBASSADOR]);

    const player2 = players.find((x) => x.name === "tester-2") as ClientPlayer;
    assert.equal(player2.coins, 7);
    assert.isTrue(player2.isHost);
    assert.isTrue(player2.isOut);
    assert.sameMembers(player2.cards, [Card.DUKE, Card.CAPTAIN]);
  });
});
