import { assert } from "chai";
import Sinon from "sinon";
import { GameEventType } from "../../src/enums";
import { playerJoinGame } from "../../src/eventHandlers/playerJoinGame";
import { GameState } from "../../src/GameState";
import { GameEvent } from "../../src/types";

describe("playerJoinGame", function () {
  it("should add player to game state", function () {
    const state = new GameState();
    assert.equal(state.players.length, 0);

    const messageAllFn = Sinon.stub();
    const event: GameEvent = {
      event: GameEventType.PLAYER_JOIN_GAME,
      user: "birdsarentreal",
    };

    playerJoinGame(state, event, messageAllFn);

    assert.equal(state.players.length, 1);
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

    assert.equal(state.currentPlayer.name, "birdsarentreal");
    assert.equal(state.currentPlayerId, 0);
  });

  it("everyone should receive player join event", function () {
    const state = new GameState();

    const messageAllFn = Sinon.fake();
    const event: GameEvent = {
      event: GameEventType.PLAYER_JOIN_GAME,
      user: "birdsarentreal",
    };

    playerJoinGame(state, event, messageAllFn);

    messageAllFn.calledWith({
      event: GameEventType.PLAYER_JOIN_GAME,
      data: { name: "birdsarentreal" },
    });
  });

  it("shouldnt be able to join a game that is started", function () {
    const state = new GameState();
    state.gameStarted = true;

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
});
