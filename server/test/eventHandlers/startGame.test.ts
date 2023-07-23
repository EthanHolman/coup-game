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

    assert.throws(function () {
      startGame(state, messageAllFn);
    });
  });

  it("shouldn't be able to start with less than 2 players", function () {
    const state = generateStateWithNPlayers(1);
    const messageAllFn = Sinon.stub();

    assert.throws(function () {
      startGame(state, messageAllFn);
    });
  });

  it("should be able to start with 2 players", function () {
    const state = generateStateWithNPlayers(2);
    const stub = Sinon.stub(state, "getStatus").returns(GameStatus.PRE_GAME);
    const messageAllFn = Sinon.stub();

    startGame(state, messageAllFn);

    stub.restore();
    assert.isFalse(state.isPaused);
    assert.strictEqual(state.getStatus(), GameStatus.AWAITING_ACTION);
    assert.strictEqual(state.currentPlayer.name, "tester-0");
  });

  it("should be able to start with more than 2 players", function () {
    const state = generateStateWithNPlayers(5);
    const stub = Sinon.stub(state, "getStatus").returns(GameStatus.PRE_GAME);
    const messageAllFn = Sinon.stub();

    startGame(state, messageAllFn);

    stub.restore();
    assert.isFalse(state.isPaused);
    assert.strictEqual(state.getStatus(), GameStatus.AWAITING_ACTION);
    assert.strictEqual(state.currentPlayer.name, "tester-0");
  });

  it("should send event to all users that game is starting", function () {
    const state = generateStateWithNPlayers(3);
    Sinon.replace(state, "getStatus", () => GameStatus.PRE_GAME);
    const messageAllFn = Sinon.stub();

    startGame(state, messageAllFn);

    Sinon.assert.calledOnceWithExactly(messageAllFn, {
      user: SERVER_USERNAME,
      event: GameEventType.START_GAME,
      data: {},
    });
  });

  it("should not allow starting the game if gameStatus is not pre-game", function () {
    const state = generateStateWithNPlayers(3);
    Sinon.replace(state, "getStatus", () => GameStatus.AWAITING_ACTION);

    assert.throws(function () {
      startGame(state, Sinon.stub());
    }, "expecting gameStatus to be pregame");
  });

  it("should set the current player to first player", function () {
    const state = new GameState();
    state.addPlayer(new Player("tester0", [Card.AMBASSADOR, Card.AMBASSADOR]));
    state.addPlayer(new Player("tester1", [Card.AMBASSADOR, Card.AMBASSADOR]));

    startGame(state, Sinon.stub());

    assert.equal(state.currentPlayerId, 0);
    assert.equal(state.currentPlayer.name, "tester0");
  });

  // TODO: someday when we have hosts: make sure only host can start the game
});
