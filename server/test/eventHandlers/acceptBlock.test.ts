import Sinon from "sinon";
import { Card } from "../../../shared/Card";
import { GameEvent } from "../../../shared/GameEvent";
import { GameActionMove, GameEventType } from "../../../shared/enums";
import { acceptBlock } from "../../src/eventHandlers/acceptBlock";
import { generateStateWithNPlayers } from "../testHelpers/stateGenerators";
import { assert } from "chai";
import * as nextTurn_all from "../../src/actions/nextTurn";

describe("acceptBlock event handler", function () {
  it("should forward block acceptance event to all users", function () {
    const mockMessageAllFn = Sinon.stub();
    const state = generateStateWithNPlayers(2);
    state.currentAction = {
      action: GameActionMove.ASSASSINATE,
      targetPlayer: "tester-1",
    };
    state.blockAction = {
      event: GameEventType.BLOCK_ACTION,
      user: "tester-1",
      data: { card: Card.CONTESSA },
    };
    const event: GameEvent = {
      event: GameEventType.ACCEPT_BLOCK,
      user: "tester-0",
    };
    acceptBlock(state, event, mockMessageAllFn);
    Sinon.assert.calledOnceWithExactly(mockMessageAllFn, event);
  });

  it("should trigger next turn", function () {
    const stub_nextTurn = Sinon.stub(nextTurn_all, "nextTurn").returns();
    const state = generateStateWithNPlayers(2);
    state.currentAction = {
      action: GameActionMove.ASSASSINATE,
      targetPlayer: "tester-1",
    };
    state.blockAction = {
      event: GameEventType.BLOCK_ACTION,
      user: "tester-1",
      data: { card: Card.CONTESSA },
    };
    const event: GameEvent = {
      event: GameEventType.ACCEPT_BLOCK,
      user: "tester-0",
    };
    acceptBlock(state, event, Sinon.stub());
    Sinon.assert.calledOnce(stub_nextTurn);
    stub_nextTurn.restore();
  });

  it("should not allow players other than current player to accept", function () {
    const state = generateStateWithNPlayers(3);
    state.currentAction = {
      action: GameActionMove.ASSASSINATE,
      targetPlayer: "tester-1",
    };
    state.blockAction = {
      event: GameEventType.BLOCK_ACTION,
      user: "tester-1",
      data: { card: Card.CONTESSA },
    };
    const event: GameEvent = {
      event: GameEventType.ACCEPT_BLOCK,
      user: "tester-2",
    };
    assert.throws(function () {
      acceptBlock(state, event, Sinon.stub());
    }, "Only current player can accept");
  });

  it("should not allow accepting a block that doesn't exist", function () {
    const state = generateStateWithNPlayers(2);
    state.currentAction = {
      action: GameActionMove.ASSASSINATE,
      targetPlayer: "tester-1",
    };
    const event: GameEvent = {
      event: GameEventType.ACCEPT_BLOCK,
      user: "tester-0",
    };
    assert.throws(function () {
      acceptBlock(state, event, Sinon.stub());
    }, "isn't a block action currently");
  });
});
