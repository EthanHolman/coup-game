import { assert } from "chai";
import { Card } from "../../../shared/Card";
import {
  GameActionMove,
  GameEventType,
  GameStatus,
} from "../../../shared/enums";
import { GameState } from "../../src/GameState";
import { Player } from "../../src/Player";
import { buildClientState } from "../../src/utils/buildClientState";
import { generateStateWithNPlayers } from "../testHelpers/stateGenerators";
import Sinon from "sinon";

describe("util buildClientState", function () {
  it("should map correct currentPlayer", function () {
    const state = generateStateWithNPlayers(2);
    const result = buildClientState(state, "tester-1");
    assert.equal(result.currentPlayerName, "tester-0");
  });

  it("should map correct game status", function () {
    const state = generateStateWithNPlayers(2);
    assert.isFalse(state.isPaused);
    assert.equal(state.status, GameStatus.AWAITING_ACTION);
    const result = buildClientState(state, "tester-1");
    assert.isFalse(result.isPaused);
    assert.equal(result.status, GameStatus.AWAITING_ACTION);
  });

  it("should map deck count correctly", function () {
    const state = generateStateWithNPlayers(2);
    state.deck.drawCard(1);
    assert.equal(state.deck.count, 14);
    const result = buildClientState(state, "tester-1");
    assert.equal(result.deckCount, 14);
  });

  it("should not include currentAction or blockAction if missing", function () {
    const state = generateStateWithNPlayers(2);
    const result = buildClientState(state, "tester-0");
    assert.isUndefined(result.currentAction);
    assert.isUndefined(result.blockAction);
  });

  it("should include currentAction if present in state", function () {
    const state = generateStateWithNPlayers(2);
    const action = {
      targetPlayer: "tester-1",
      action: GameActionMove.ASSASSINATE,
    };
    state.currentAction = action;
    const result = buildClientState(state, "tester-0");
    assert.deepStrictEqual(result.currentAction, action);
  });

  it("should include blockAction if present in state", function () {
    const state = generateStateWithNPlayers(2);
    Sinon.replaceGetter(state, "status", () => GameStatus.ACTION_BLOCKED);
    const action = {
      event: GameEventType.BLOCK_ACTION,
      user: "tester-1",
    };
    state.blockAction = action;
    const result = buildClientState(state, "tester-0");
    assert.deepStrictEqual(result.blockAction, action);
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
    assert.sameDeepMembers(player0.cards, [
      { card: Card.HIDDEN_CARD, isRevealed: false },
      { card: Card.HIDDEN_CARD, isRevealed: false },
    ]);

    const player1 = players.find((x) => x.name === "tester-1")!;
    assert.equal(player1.coins, 0);
    assert.isFalse(player1.isHost);
    assert.isFalse(player1.isOut);
    assert.sameDeepMembers(player1.cards, [
      { card: Card.HIDDEN_CARD, isRevealed: false },
      { card: Card.AMBASSADOR, isRevealed: true },
    ]);

    const player2 = players.find((x) => x.name === "tester-2")!;
    assert.equal(player2.coins, 7);
    assert.isTrue(player2.isHost);
    assert.isTrue(player2.isOut);
    assert.sameDeepMembers(player2.cards, [
      { card: Card.DUKE, isRevealed: true },
      { card: Card.CAPTAIN, isRevealed: true },
    ]);
  });

  it("should not hide cards for the player we build state for", function () {
    const state = new GameState();
    const p0 = new Player("tester-0", [Card.CONTESSA, Card.AMBASSADOR], false);
    state.addPlayer(p0);
    const p1 = new Player("tester-1", [Card.ASSASSIN, Card.CAPTAIN], false);
    state.addPlayer(p1);

    const { players } = buildClientState(state, "tester-1");

    const player0 = players.find((x) => x.name === "tester-0")!;
    assert.sameDeepMembers(player0.cards, [
      { card: Card.HIDDEN_CARD, isRevealed: false },
      { card: Card.HIDDEN_CARD, isRevealed: false },
    ]);
    const player1 = players.find((x) => x.name === "tester-1")!;
    assert.sameDeepMembers(player1.cards, [
      { card: Card.ASSASSIN, isRevealed: false },
      { card: Card.CAPTAIN, isRevealed: false },
    ]);
  });
});
