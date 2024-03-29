import Sinon from "sinon";
import { Card } from "../../../shared/Card";
import { GameEvent } from "../../../shared/GameEvent";
import {
  GameActionMove,
  GameEventType,
  GameStatus,
} from "../../../shared/enums";
import { acceptBlock } from "../../src/eventHandlers/acceptBlock";
import { generateStateWithNPlayers } from "../testHelpers/stateGenerators";
import { assert } from "chai";
import * as module_nextTurn from "../../src/actions/nextTurn";

describe("acceptBlock event handler", function () {
  let mock_nextTurn: Sinon.SinonStub;

  this.beforeEach(function () {
    mock_nextTurn = Sinon.stub(module_nextTurn, "nextTurn").returns();
  });

  this.afterEach(function () {
    mock_nextTurn.restore();
  });

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
    Sinon.assert.calledOnceWithExactly(
      mockMessageAllFn,
      Sinon.match.any,
      event
    );
  });

  it("should trigger next turn", function () {
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
    Sinon.assert.calledOnce(mock_nextTurn);
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

  it("should not allow accepting a block when GameStatus is not ACTION_BLOCKED", function () {
    const state = generateStateWithNPlayers(2);
    Sinon.replace(state, "getStatus", () => GameStatus.AWAITING_ACTION);
    const event: GameEvent = {
      event: GameEventType.ACCEPT_BLOCK,
      user: "tester-0",
    };
    assert.throws(function () {
      acceptBlock(state, event, Sinon.stub());
    }, "accept block is only valid when status = ACTION_BLOCKED");
  });
});
