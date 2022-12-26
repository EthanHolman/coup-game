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
    const messagePlayerFn = Sinon.stub();
    const event: GameEvent = {
      event: GameEventType.PLAYER_JOIN_GAME,
      user: "birdsarentreal",
    };

    playerJoinGame(state, event, messageAllFn, messagePlayerFn);

    assert.equal(state.players.length, 1);
  });

  it("players cards should be removed from top of deck", function () {
    const state = new GameState();

    const originalDeck = [...state.deck._deck];

    const messageAllFn = Sinon.stub();
    const messagePlayerFn = Sinon.stub();
    const event: GameEvent = {
      event: GameEventType.PLAYER_JOIN_GAME,
      user: "birdsarentreal",
    };

    playerJoinGame(state, event, messageAllFn, messagePlayerFn);

    assert.deepEqual(state.deck._deck, originalDeck.slice(2));
    assert.isTrue(state.players[0].hasCard(originalDeck[0]));
    assert.isTrue(state.players[0].hasCard(originalDeck[1]));
  });

  it("first player to join should be 'current' player", function () {
    const state = new GameState();

    const messageAllFn = Sinon.stub();
    const messagePlayerFn = Sinon.stub();
    const event1: GameEvent = {
      event: GameEventType.PLAYER_JOIN_GAME,
      user: "birdsarentreal",
    };

    const event2: GameEvent = { ...event1, user: "hello" };

    playerJoinGame(state, event1, messageAllFn, messagePlayerFn);
    playerJoinGame(state, event2, messageAllFn, messagePlayerFn);

    assert.equal(state.currentPlayer.name, "birdsarentreal");
    assert.equal(state.currentPlayerId, 0);
  });

  it("everyone should receive player join event", function () {
    const state = new GameState();

    const messageAllFn = Sinon.fake();
    const messagePlayerFn = Sinon.stub();
    const event: GameEvent = {
      event: GameEventType.PLAYER_JOIN_GAME,
      user: "birdsarentreal",
    };

    playerJoinGame(state, event, messageAllFn, messagePlayerFn);

    Sinon.assert.calledOnceWithExactly(messageAllFn, {
      event: GameEventType.PLAYER_JOIN_GAME,
      data: { name: "birdsarentreal" },
    });
  });

  it("shouldnt be able to join a game that is started", function () {
    const state = new GameState();
    state.gameStarted = true;

    const messageAllFn = Sinon.stub();
    const messagePlayerFn = Sinon.stub();
    const event: GameEvent = {
      event: GameEventType.PLAYER_JOIN_GAME,
      user: "birdsarentreal",
    };

    assert.throws(function () {
      playerJoinGame(state, event, messageAllFn, messagePlayerFn);
    }, "game has already started");
  });

  it("shouldnt be able to join with a duplicate username", function () {
    const state = new GameState();

    const messageAllFn = Sinon.stub();
    const messagePlayerFn = Sinon.stub();
    const event: GameEvent = {
      event: GameEventType.PLAYER_JOIN_GAME,
      user: "birdsarentreal",
    };

    playerJoinGame(state, event, messageAllFn, messagePlayerFn);

    assert.throws(function () {
      playerJoinGame(state, event, messageAllFn, messagePlayerFn);
    }, "birdsarentreal has already been");
  });

  it("should send event to new player with current game state -- no existing players", function () {
    const state = new GameState();

    const messageAllFn = Sinon.stub();
    const messagePlayerFn = Sinon.fake();
    const event: GameEvent = {
      event: GameEventType.PLAYER_JOIN_GAME,
      user: "birdsarentreal",
    };

    playerJoinGame(state, event, messageAllFn, messagePlayerFn);

    Sinon.assert.calledOnceWithExactly(messagePlayerFn, "birdsarentreal", {
      event: GameEventType.WELCOME,
      data: { playerNames: ["birdsarentreal"] },
    });
  });

  it("should send event to new player with current game state -- some existing players", function () {
    const state = new GameState();
    const messageAllFn = Sinon.stub();

    // player 1 joins...
    const player1: GameEvent = {
      event: GameEventType.PLAYER_JOIN_GAME,
      user: "birdsarentreal",
    };
    const messagePlayer1Fn = Sinon.fake();

    playerJoinGame(state, player1, messageAllFn, messagePlayer1Fn);

    Sinon.assert.calledOnce(messagePlayer1Fn);
    Sinon.assert.calledWithExactly(messagePlayer1Fn, "birdsarentreal", {
      event: GameEventType.WELCOME,
      data: { playerNames: ["birdsarentreal"] },
    });

    // player 2 joins...
    const player2: GameEvent = {
      event: GameEventType.PLAYER_JOIN_GAME,
      user: "anotherplayer",
    };
    const messagePlayer2Fn = Sinon.fake();

    playerJoinGame(state, player2, messageAllFn, messagePlayer2Fn);

    Sinon.assert.calledOnce(messagePlayer2Fn);
    Sinon.assert.calledWithExactly(messagePlayer2Fn, "anotherplayer", {
      event: GameEventType.WELCOME,
      data: { playerNames: ["birdsarentreal", "anotherplayer"] },
    });
  });
});
