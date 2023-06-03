import { assert } from "chai";
import Sinon from "sinon";
import { GameEventType } from "../../../shared/enums";
import { resumeGame } from "../../src/actions/resumeGame";
import { createServerEvent } from "../../src/utils/createServerEvent";
import { GameState } from "../../src/GameState";

describe("resumeGame event handler", function () {
  it("should update isPaused to false", function () {
    const state = new GameState();
    state.pause();
    const messageAllFn = Sinon.stub();

    resumeGame(state, messageAllFn);

    assert.isFalse(state.isPaused);
  });

  it("should alert all users that game is running again", function () {
    const state = new GameState();
    state.pause();
    const messageAllFn = Sinon.fake();

    resumeGame(state, messageAllFn);

    const expectedEvent = createServerEvent(GameEventType.RESUME_GAME, {
      reason: "game resumed",
    });

    Sinon.assert.calledOnceWithExactly(messageAllFn, expectedEvent);
    assert.isFalse(state.isPaused);
  });

  it("should allow custom resume reason", function () {
    const state = new GameState();
    state.pause();
    const messageAllFn = Sinon.fake();

    resumeGame(state, messageAllFn, "resume just for fun");

    const expectedEvent = createServerEvent(GameEventType.RESUME_GAME, {
      reason: "resume just for fun",
    });

    Sinon.assert.calledOnceWithExactly(messageAllFn, expectedEvent);
    assert.isFalse(state.isPaused);
  });

  it("should fail if game is not paused", function () {
    const state = new GameState();
    state.isPaused = false;
    const messageAllFn = Sinon.stub();

    assert.throws(function () {
      resumeGame(state, messageAllFn);
    }, "not currently paused");
  });
});
