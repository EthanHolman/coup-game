import { assert } from "chai";
import { GameState } from "../../src/GameState";
import { startGame } from "../../src/eventHandlers/startGame";
import { generateStateWithNPlayers } from "../testHelpers/stateGenerators";
import Sinon from "sinon";
import { GameEventType, GameStatus } from "../../../shared/enums";
import { SERVER_USERNAME } from "../../../shared/globals";
import { Player } from "../../src/Player";
import { Card } from "../../../shared/Card";

describe("startGame", function () {
  it("shouldn't be able to start without players", function () {
    const state = new GameState();
    const messageAllFn = Sinon.stub();

    const event = { user: "tester-0", event: GameEventType.START_GAME };

    assert.throws(function () {
      startGame(state, event, messageAllFn);
    });
  });

  it("shouldn't be able to start with less than 2 players", function () {
    const state = generateStateWithNPlayers(1);
    const messageAllFn = Sinon.stub();

    const event = { user: "tester-0", event: GameEventType.START_GAME };

    assert.throws(function () {
      startGame(state, event, messageAllFn);
    }, "at least 2 players");
  });

  it("should be able to start with 2 players", function () {
    const state = generateStateWithNPlayers(2);
    const stub = Sinon.stub(state, "getStatus").returns(GameStatus.PRE_GAME);

    const event = { user: "tester-0", event: GameEventType.START_GAME };

    startGame(state, event, Sinon.stub());

    stub.restore();
    assert.isFalse(state.isPaused);
    assert.strictEqual(state.getStatus(), GameStatus.AWAITING_ACTION);
    assert.strictEqual(state.currentPlayer.name, "tester-0");
  });

  it("should be able to start with more than 2 players", function () {
    const state = generateStateWithNPlayers(5);
    const stub = Sinon.stub(state, "getStatus").returns(GameStatus.PRE_GAME);

    const event = { user: "tester-0", event: GameEventType.START_GAME };

    startGame(state, event, Sinon.stub());

    stub.restore();
    assert.isFalse(state.isPaused);
    assert.strictEqual(state.getStatus(), GameStatus.AWAITING_ACTION);
    assert.strictEqual(state.currentPlayer.name, "tester-0");
  });

  it("should send event to all users that game is starting", function () {
    const state = generateStateWithNPlayers(3);
    Sinon.replace(state, "getStatus", () => GameStatus.PRE_GAME);
    const messageAllFn = Sinon.stub();

    const event = { user: "tester-0", event: GameEventType.START_GAME };

    startGame(state, event, messageAllFn);

    Sinon.assert.calledOnceWithExactly(messageAllFn, {
      user: SERVER_USERNAME,
      event: GameEventType.START_GAME,
      data: {},
    });
  });

  it("should not allow starting the game if gameStatus is not pre-game", function () {
    const state = generateStateWithNPlayers(3);
    Sinon.replace(state, "getStatus", () => GameStatus.AWAITING_ACTION);

    const event = { user: "tester-0", event: GameEventType.START_GAME };

    assert.throws(function () {
      startGame(state, event, Sinon.stub());
    }, "expecting gameStatus to be pregame");
  });

  it("should set the current player to first player", function () {
    const state = new GameState();
    state.addPlayer(
      new Player("tester0", [Card.AMBASSADOR, Card.AMBASSADOR], true)
    );
    state.addPlayer(new Player("tester1", [Card.AMBASSADOR, Card.AMBASSADOR]));

    const event = { user: "tester0", event: GameEventType.START_GAME };

    startGame(state, event, Sinon.stub());

    assert.equal(state.currentPlayerId, 0);
    assert.equal(state.currentPlayer.name, "tester0");
  });

  it("should not allow non-hosts to start the game", function () {
    const state = generateStateWithNPlayers(2);
    const stub = Sinon.stub(state, "getStatus").returns(GameStatus.PRE_GAME);

    const event = { user: "tester-1", event: GameEventType.START_GAME };

    assert.throws(function () {
      startGame(state, event, Sinon.stub());
    }, "Only the host can start the game");

    stub.restore();
  });
});
