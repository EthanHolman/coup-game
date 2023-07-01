import { assert } from "chai";
import Sinon from "sinon";
import { GameEventType } from "../../../shared/enums";
import { Card } from "../../../shared/Card";
import { playerJoinGame } from "../../src/eventHandlers/playerJoinGame";
import { GameEvent } from "../../../shared/GameEvent";
import { GameState } from "../../src/GameState";
import { Player } from "../../src/Player";

describe("playerJoinGame event handler", function () {
  it("should add player to game state", function () {
    const state = new GameState();
    assert.strictEqual(state.players.length, 0);

    const messageAllFn = Sinon.stub();
    const event: GameEvent = {
      event: GameEventType.PLAYER_JOIN_GAME,
      user: "birdsarentreal",
    };

    playerJoinGame(state, event, messageAllFn);

    assert.strictEqual(state.players.length, 1);
  });

  it("players cards should be removed from top of deck", function () {
    const state = new GameState();

    const originalDeck = [...state.deck._deck];

    const messageAllFn = Sinon.stub();
    const event: GameEvent = {
      event: GameEventType.PLAYER_JOIN_GAME,
      user: "birdsarentreal",
    };

    playerJoinGame(state, event, messageAllFn);

    assert.deepEqual(state.deck._deck, originalDeck.slice(2));
    assert.isTrue(state.players[0].hasCard(originalDeck[0]));
    assert.isTrue(state.players[0].hasCard(originalDeck[1]));
  });

  it("first player to join should be 'current' player", function () {
    const state = new GameState();

    const messageAllFn = Sinon.stub();
    const event1: GameEvent = {
      event: GameEventType.PLAYER_JOIN_GAME,
      user: "birdsarentreal",
    };

    const event2: GameEvent = { ...event1, user: "hello" };

    playerJoinGame(state, event1, messageAllFn);
    playerJoinGame(state, event2, messageAllFn);

    assert.strictEqual(state.currentPlayer.name, "birdsarentreal");
    assert.strictEqual(state.currentPlayerId, 0);
  });

  it("everyone should receive player join event", function () {
    const state = new GameState();

    const messageAllFn = Sinon.fake();
    const event: GameEvent = {
      event: GameEventType.PLAYER_JOIN_GAME,
      user: "birdsarentreal",
    };

    playerJoinGame(state, event, messageAllFn);

    Sinon.assert.calledOnceWithExactly(messageAllFn, {
      event: GameEventType.PLAYER_JOIN_GAME,
      user: "birdsarentreal",
    });
  });

  it("shouldnt be able to join a game that is started", function () {
    const state = new GameState();
    state.start();

    const messageAllFn = Sinon.stub();
    const event: GameEvent = {
      event: GameEventType.PLAYER_JOIN_GAME,
      user: "birdsarentreal",
    };

    assert.throws(function () {
      playerJoinGame(state, event, messageAllFn);
    }, "game has already started");
  });

  it("shouldnt be able to join with a duplicate username", function () {
    const state = new GameState();

    const messageAllFn = Sinon.stub();
    const event: GameEvent = {
      event: GameEventType.PLAYER_JOIN_GAME,
      user: "birdsarentreal",
    };

    playerJoinGame(state, event, messageAllFn);

    assert.throws(function () {
      playerJoinGame(state, event, messageAllFn);
    }, "birdsarentreal has already been");
  });

  it("should allow players to rejoin if disconnected", function () {
    const state = new GameState();
    state.start();
    state.pause();
    const testPlayer = new Player("tommy tester", [Card.DUKE, Card.DUKE]);
    testPlayer.isConnected = false;
    state.addPlayer(testPlayer);

    assert.isTrue(state.isPaused);
    assert.strictEqual(state.players.length, 1);

    const playerJoinEvent: GameEvent = {
      event: GameEventType.PLAYER_JOIN_GAME,
      user: "tommy tester",
    };

    playerJoinGame(state, playerJoinEvent, Sinon.stub());

    assert.isFalse(state.isPaused);
    assert.strictEqual(state.players.length, 1);
    assert.isTrue(state.players[0].isConnected);
  });

  it("rejoined players should still have their cards", function () {
    const state = new GameState();
    state.start();
    state.pause();
    const testPlayer = new Player("tommy tester", [Card.DUKE, Card.CONTESSA]);
    testPlayer.revealCard(Card.DUKE);
    testPlayer.isConnected = false;
    state.addPlayer(testPlayer);

    assert.isTrue(state.isPaused);
    assert.strictEqual(state.players.length, 1);

    const playerJoinEvent: GameEvent = {
      event: GameEventType.PLAYER_JOIN_GAME,
      user: "tommy tester",
    };

    playerJoinGame(state, playerJoinEvent, Sinon.stub());

    assert.isTrue(state.players[0].hasCard(Card.CONTESSA));
    assert.isTrue(
      state.players[0].cards.find((x) => x.card === Card.DUKE)!.isRevealed
    );
  });

  it("should not restart the game if only one of two disconnected players rejoin", function () {
    const state = new GameState();
    state.start();
    state.pause();

    const testPlayer1 = new Player("lois", [Card.DUKE, Card.DUKE]);
    testPlayer1.isConnected = false;
    state.addPlayer(testPlayer1);

    const testPlayer2 = new Player("peter", [Card.CONTESSA, Card.CONTESSA]);
    testPlayer2.isConnected = false;
    state.addPlayer(testPlayer2);

    assert.isTrue(state.isPaused);
    assert.strictEqual(state.players.length, 2);

    const playerJoinEvent: GameEvent = {
      event: GameEventType.PLAYER_JOIN_GAME,
      user: "lois",
    };

    playerJoinGame(state, playerJoinEvent, Sinon.stub());

    assert.isTrue(state.isPaused);
    assert.strictEqual(state.players.length, 2);
    assert.isTrue(state.players.find((x) => x.name === "lois")!.isConnected);
    assert.isFalse(state.players.find((x) => x.name === "peter")!.isConnected);
  });

  it("should restart the game when all disconnected players rejoin", function () {
    const state = new GameState();
    state.start();
    state.pause();

    const testPlayer1 = new Player("lois", [Card.DUKE, Card.DUKE]);
    testPlayer1.isConnected = false;
    state.addPlayer(testPlayer1);

    const testPlayer2 = new Player("peter", [Card.CONTESSA, Card.CONTESSA]);
    testPlayer2.isConnected = false;
    state.addPlayer(testPlayer2);

    assert.isTrue(state.isPaused);
    assert.strictEqual(state.players.length, 2);

    const playerJoinEvent: GameEvent = {
      event: GameEventType.PLAYER_JOIN_GAME,
      user: "lois",
    };

    playerJoinGame(state, playerJoinEvent, Sinon.stub());

    assert.isTrue(state.isPaused);
    assert.isTrue(state.players.find((x) => x.name === "lois")!.isConnected);
    assert.isFalse(state.players.find((x) => x.name === "peter")!.isConnected);

    playerJoinGame(state, { ...playerJoinEvent, user: "peter" }, Sinon.stub());

    assert.isFalse(state.isPaused);
    assert.strictEqual(state.players.length, 2);
    assert.isTrue(state.players.find((x) => x.name === "lois")?.isConnected);
    assert.isTrue(state.players.find((x) => x.name === "peter")?.isConnected);
  });

  it("should make new player the host if they are first to join", function () {
    const state = new GameState();

    playerJoinGame(
      state,
      { event: GameEventType.PLAYER_JOIN_GAME, user: "ethan", data: {} },
      Sinon.stub()
    );

    assert.strictEqual(state.players.length, 1);
    assert.isTrue(state.players.find((x) => x.name === "ethan")?.isHost);
  });
});
