import { assert } from "chai";
import Sinon from "sinon";
import { GameEventType } from "../../src/enums";
import { resumeGame } from "../../src/eventHandlers/resumeGame";
import { GameState } from "../../src/GameState";
import { GameEvent } from "../../src/types";

describe("resumeGame event handler", function () {
  it("should update gamestatus to RUNNING", function () {
    const state = new GameState();
    state.gameStatus = "PAUSED";
    const messageAllFn = Sinon.stub();

    const event: GameEvent = {
      event: GameEventType.RESUME_GAME,
      user: "__server",
      data: {
        reason: "continue game!",
      },
    };

    resumeGame(state, event, messageAllFn);

    assert.equal(state.gameStatus, "RUNNING");
  });

  it("should alert all users that game is running again", function () {
    const state = new GameState();
    state.gameStatus = "PAUSED";
    const messageAllFn = Sinon.fake();

    const event: GameEvent = {
      event: GameEventType.RESUME_GAME,
      user: "__server",
      data: {
        reason: "continue game!",
      },
    };

    resumeGame(state, event, messageAllFn);

    Sinon.assert.calledOnceWithExactly(messageAllFn, event);
  });

  it("should fail if gamestatus is not paused", function () {
    const state = new GameState();
    state.gameStatus = "PRE_GAME";
    const messageAllFn = Sinon.stub();

    const event: GameEvent = {
      event: GameEventType.RESUME_GAME,
      user: "__server",
      data: {},
    };

    assert.throws(function () {
      resumeGame(state, event, messageAllFn);
    }, "game cannot be resumed");

    state.gameStatus = "RUNNING";

    assert.throws(function () {
      resumeGame(state, event, messageAllFn);
    }, "game cannot be resumed");
  });
});
