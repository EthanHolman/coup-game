import { assert } from "chai";
import Sinon from "sinon";
import { GameEventType } from "../../src/enums";
import { pauseGame } from "../../src/eventHandlers/pauseGame";
import { GameState } from "../../src/GameState";
import { GameEvent } from "../../src/types";

describe("pauseGame", function () {
  it("should update gamestatus to paused", function () {
    const state = new GameState();
    state.gameStatus = "RUNNING";
    const messageAllFn = Sinon.stub();

    const event: GameEvent = {
      event: GameEventType.PAUSE_GAME,
      user: "__server",
      data: {
        reason: "because why not pause game",
      },
    };

    pauseGame(state, event, messageAllFn);

    assert.equal(state.gameStatus, "PAUSED");
  });

  it("should alert all users that game is paused", function () {
    const state = new GameState();
    state.gameStatus = "RUNNING";
    const messageAllFn = Sinon.fake();

    const event: GameEvent = {
      event: GameEventType.PAUSE_GAME,
      user: "__server",
      data: {
        reason: "because why not pause game",
      },
    };

    pauseGame(state, event, messageAllFn);

    Sinon.assert.calledOnceWithExactly(messageAllFn, event);
  });

  it("should fail if game is not yet started", function () {
    const state = new GameState();
    const messageAllFn = Sinon.stub();

    const event: GameEvent = {
      event: GameEventType.PAUSE_GAME,
      user: "__server",
      data: {},
    };

    assert.throws(function () {
      pauseGame(state, event, messageAllFn);
    }, "cannot pause game during pre-game");
  });
});
