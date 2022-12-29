import { assert } from "chai";
import Sinon from "sinon";
import { GameEventType } from "../../src/enums";
import { resumeGame } from "../../src/actions/resumeGame";
import { GameState } from "../../src/GameState";
import { ServerEvent } from "../../src/types";

describe("resumeGame event handler", function () {
  it("should update gamestatus to RUNNING", function () {
    const state = new GameState();
    state.pause();
    const messageAllFn = Sinon.stub();

    resumeGame(state, messageAllFn);

    assert.equal(state.gameStatus, "RUNNING");
  });

  it("should alert all users that game is running again", function () {
    const state = new GameState();
    state.pause();
    const messageAllFn = Sinon.fake();

    resumeGame(state, messageAllFn);

    const expectedEvent: ServerEvent = {
      event: GameEventType.RESUME_GAME,
      data: { reason: "game resumed" },
    };

    Sinon.assert.calledOnceWithExactly(messageAllFn, expectedEvent);
    assert.equal(state.gameStatus, "RUNNING");
  });

  it("should allow custom resume reason", function () {
    const state = new GameState();
    state.pause();
    const messageAllFn = Sinon.fake();

    resumeGame(state, messageAllFn, "resume just for fun");

    const expectedEvent: ServerEvent = {
      event: GameEventType.RESUME_GAME,
      data: { reason: "resume just for fun" },
    };

    Sinon.assert.calledOnceWithExactly(messageAllFn, expectedEvent);
    assert.equal(state.gameStatus, "RUNNING");
  });

  it("should fail if gamestatus is not paused", function () {
    const state = new GameState();
    state._gameStatus = "PRE_GAME";
    const messageAllFn = Sinon.stub();

    assert.throws(function () {
      resumeGame(state, messageAllFn);
    }, "game cannot be resumed");

    state._gameStatus = "RUNNING";

    assert.throws(function () {
      resumeGame(state, messageAllFn);
    }, "game cannot be resumed");
  });
});
