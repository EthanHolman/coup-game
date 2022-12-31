import Sinon from "sinon";
import { GameState } from "../../src/GameState";
import { GameEvent } from "../../src/types";
import { GameEventType, GameActionMove } from "../../src/enums";
import { chooseAction } from "../../src/eventHandlers/chooseAction";
import { assert } from "chai";

describe("chooseAction event handler", function () {
  it("should set the current active", function () {
    const state = new GameState();

    const event: GameEvent = {
      event: GameEventType.CHOOSE_ACTION,
      user: "ethan",
      data: { action: GameActionMove.EXCHANGE },
    };

    chooseAction(state, event, Sinon.stub());

    assert.equal(state.activeAction, GameActionMove.EXCHANGE);
  });

  it("should not allow proposing invalid actions", function () {});

  it("should relay event to all players", function () {});

  it("should not allow things that arent game action moves", function () {});
});
