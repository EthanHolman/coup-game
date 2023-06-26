import { assert } from "chai";
import { GameState } from "../../src/GameState";
import { startGame } from "../../src/eventHandlers/startGame";
import { generateStateWithNPlayers } from "../testHelpers/stateGenerators";
import Sinon from "sinon";
import { GameEventType, GameStatus } from "../../../shared/enums";
import { SERVER_USERNAME } from "../../../shared/globals";

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
    const messageAllFn = Sinon.stub();

    startGame(state, messageAllFn);

    assert.isFalse(state.isPaused);
    assert.equal(state.getStatus(), GameStatus.AWAITING_ACTION);
    assert.equal(state.currentPlayer.name, "tester-0");
  });

  it("should be able to start with more than 2 players", function () {
    const state = generateStateWithNPlayers(5);
    const messageAllFn = Sinon.stub();

    startGame(state, messageAllFn);

    assert.isFalse(state.isPaused);
    assert.equal(state.getStatus(), GameStatus.AWAITING_ACTION);
    assert.equal(state.currentPlayer.name, "tester-0");
  });

  it("should send event to all users that game is starting", function () {
    const state = generateStateWithNPlayers(3);
    const messageAllFn = Sinon.stub();

    startGame(state, messageAllFn);

    Sinon.assert.calledOnceWithExactly(messageAllFn, {
      user: SERVER_USERNAME,
      event: GameEventType.START_GAME,
      data: {},
    });
  });

  // TODO: someday when we have hosts: make sure only host can start the game
});
