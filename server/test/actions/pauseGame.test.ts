import { assert } from "chai";
import Sinon from "sinon";
import { GameEventType } from "../../src/enums";
import { pauseGame } from "../../src/actions/pauseGame";
import { GameState } from "../../src/GameState";
import { ServerEvent } from "../../src/types";

describe("pauseGame", function () {
  it("should update gamestatus to paused", function () {
    const state = new GameState();
    state.start();
    const messageAllFn = Sinon.stub();

    pauseGame(state, messageAllFn);

    assert.equal(state.gameStatus, "PAUSED");
  });

  it("should alert all users that game is paused with default reason", function () {
    const state = new GameState();
    state.start();
    const messageAllFn = Sinon.fake();

    pauseGame(state, messageAllFn);

    const expectedEvent: ServerEvent = {
      event: GameEventType.PAUSE_GAME,
      data: { reason: "game paused" },
    };

    Sinon.assert.calledOnceWithExactly(messageAllFn, expectedEvent);
    assert.equal(state.gameStatus, "PAUSED");
  });

  it("should allow pausing game with custom reason", function () {
    const state = new GameState();
    state.start();
    const messageAllFn = Sinon.fake();

    pauseGame(state, messageAllFn, "because i wanna pause it");

    const expectedEvent: ServerEvent = {
      event: GameEventType.PAUSE_GAME,
      data: { reason: "because i wanna pause it" },
    };

    Sinon.assert.calledOnceWithExactly(messageAllFn, expectedEvent);
    assert.equal(state.gameStatus, "PAUSED");
  });

  it("should fail if game is not yet started", function () {
    const state = new GameState();
    const messageAllFn = Sinon.stub();

    assert.throws(function () {
      pauseGame(state, messageAllFn);
    }, "cannot pause game during pre-game");
  });
});
