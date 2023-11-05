import { assert } from "chai";
import Sinon from "sinon";
import { GameEventType } from "../../../shared/enums";
import { pauseGame } from "../../src/actions/pauseGame";
import { createServerEvent } from "../../src/utils/createServerEvent";
import { GameState } from "../../src/GameState";

describe("pauseGame", function () {
  it("should update isPaused to true", function () {
    const state = new GameState();
    state.start();
    const messageAllFn = Sinon.stub();

    pauseGame(state, messageAllFn);

    assert.isTrue(state.isPaused);
  });

  it("should alert all users that game is paused with default reason", function () {
    const state = new GameState();
    state.start();
    const messageAllFn = Sinon.fake();

    pauseGame(state, messageAllFn);

    const expectedEvent = createServerEvent(GameEventType.PAUSE_GAME, {
      reason: "game paused",
    });

    Sinon.assert.calledOnceWithExactly(
      messageAllFn,
      Sinon.match.any,
      expectedEvent
    );
    assert.isTrue(state.isPaused);
  });

  it("should allow pausing game with custom reason", function () {
    const state = new GameState();
    state.start();
    const messageAllFn = Sinon.fake();

    pauseGame(state, messageAllFn, "because i wanna pause it");

    const expectedEvent = createServerEvent(GameEventType.PAUSE_GAME, {
      reason: "because i wanna pause it",
    });

    Sinon.assert.calledOnceWithExactly(
      messageAllFn,
      Sinon.match.any,
      expectedEvent
    );
    assert.isTrue(state.isPaused);
  });

  it("should fail if game is not yet started", function () {
    const state = new GameState();
    const messageAllFn = Sinon.stub();

    assert.throws(function () {
      pauseGame(state, messageAllFn);
    }, "cannot pause game during pre-game");
  });
});
