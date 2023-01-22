import { assert } from "chai";
import Sinon from "sinon";
import { ALL_GAME_EVENT_TYPES, GameEventType } from "../src/enums";
import { ACTIONS_ALLOWED_WHILE_PAUSED, GameRunner } from "../src/Game";

describe("gamerunner", function () {
  it("should be creatable", function () {
    const runner = new GameRunner({
      messagePlayer: Sinon.fake(),
      messageAll: Sinon.fake(),
    });

    assert.isNotNull(runner);
    assert.isObject(runner);
  });

  it("should not allow most actions while game is paused", function () {
    const runner = new GameRunner({
      messagePlayer: Sinon.fake(),
      messageAll: Sinon.fake(),
    });

    runner._gameState.pause();

    const actionsNotAllowed = ALL_GAME_EVENT_TYPES.filter(
      (x) => !ACTIONS_ALLOWED_WHILE_PAUSED.includes(x)
    );

    actionsNotAllowed.forEach((event) => {
      assert.throws(function () {
        runner.onEvent({
          event,
          user: "doesntmatter",
        });
      }, "no actions are allowed until the game is unpaused");
    });
  });
});
