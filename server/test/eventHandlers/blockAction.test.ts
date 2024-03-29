import { assert } from "chai";
import { Card } from "../../../shared/Card";
import { GameEvent } from "../../../shared/GameEvent";
import {
  GameActionMove,
  GameEventType,
  GameStatus,
} from "../../../shared/enums";
import { blockAction } from "../../src/eventHandlers/blockAction";
import { generateStateWithNPlayers } from "../testHelpers/stateGenerators";
import { ALL_CARDS } from "../../../shared/Card";
import { ALL_GAME_ACTION_MOVES } from "../../../shared/enums";
import { BLOCKABLE_ACTIONS } from "../../../shared/enums";
import Sinon from "sinon";

describe("blockAction event handler", function () {
  it("should not allow blocking user's own action", function () {
    const state = generateStateWithNPlayers(2);
    assert.strictEqual(state.currentPlayer.name, "tester-0");
    state.currentAction = {
      action: GameActionMove.STEAL,
      targetPlayer: "tester-1",
    };
    const event: GameEvent = {
      event: GameEventType.BLOCK_ACTION,
      user: "tester-0",
      data: { card: Card.CAPTAIN },
    };
    assert.throws(function () {
      blockAction(state, event, Sinon.stub());
    }, "Cannot block your own action");
    assert.isUndefined(state.blockAction);
  });

  it("should allow 'contessa' to block assassination'", function () {
    const state = generateStateWithNPlayers(2);
    assert.strictEqual(state.currentPlayer.name, "tester-0");
    state.currentAction = {
      action: GameActionMove.ASSASSINATE,
      targetPlayer: "tester-1",
    };
    const event: GameEvent = {
      event: GameEventType.BLOCK_ACTION,
      user: "tester-1",
      data: { card: Card.CONTESSA },
    };
    blockAction(state, event, Sinon.stub());
    assert.deepEqual(state.blockAction, event);
  });

  it("should not allow blocking assassination with cards other than contessa", function () {
    const state = generateStateWithNPlayers(2);
    assert.strictEqual(state.currentPlayer.name, "tester-0");
    state.currentAction = {
      action: GameActionMove.ASSASSINATE,
      targetPlayer: "tester-1",
    };
    ALL_CARDS.filter((card) => card !== Card.CONTESSA).forEach((card) => {
      const event: GameEvent = {
        event: GameEventType.BLOCK_ACTION,
        user: "tester-1",
        data: { card },
      };
      assert.throws(function () {
        blockAction(state, event, Sinon.stub());
      }, "requires contessa");
      assert.isUndefined(state.blockAction);
    });
  });

  it("shouldn't allow blocking as contessa if user isn't the action target", function () {
    const state = generateStateWithNPlayers(3);
    assert.strictEqual(state.currentPlayer.name, "tester-0");
    state.currentAction = {
      action: GameActionMove.ASSASSINATE,
      targetPlayer: "tester-1",
    };
    const event: GameEvent = {
      event: GameEventType.BLOCK_ACTION,
      user: "tester-2",
      data: { card: Card.CONTESSA },
    };
    assert.throws(function () {
      blockAction(state, event, Sinon.stub());
    }, "Only the target player can block using a contessa");
    assert.isUndefined(state.blockAction);
  });

  it("should allow 'duke' to block foreign aid'", function () {
    const state = generateStateWithNPlayers(2);
    assert.strictEqual(state.currentPlayer.name, "tester-0");
    state.currentAction = { action: GameActionMove.FOREIGN_AID };
    const event: GameEvent = {
      event: GameEventType.BLOCK_ACTION,
      user: "tester-1",
      data: { card: Card.DUKE },
    };
    blockAction(state, event, Sinon.stub());
    assert.deepEqual(state.blockAction, event);
  });

  it("should not allow blocking foreign aid with cards other than duke", function () {
    const state = generateStateWithNPlayers(2);
    assert.strictEqual(state.currentPlayer.name, "tester-0");
    state.currentAction = { action: GameActionMove.FOREIGN_AID };
    ALL_CARDS.filter((card) => card !== Card.DUKE).forEach((card) => {
      const event: GameEvent = {
        event: GameEventType.BLOCK_ACTION,
        user: "tester-1",
        data: { card },
      };
      assert.throws(function () {
        blockAction(state, event, Sinon.stub());
      }, "requires duke");
      assert.isUndefined(state.blockAction);
    });
  });

  it("should allow 'ambassador/captain' to block stealing'", function () {
    [Card.AMBASSADOR, Card.CAPTAIN].forEach((card) => {
      const state = generateStateWithNPlayers(2);
      assert.strictEqual(state.currentPlayer.name, "tester-0");
      state.currentAction = {
        action: GameActionMove.STEAL,
        targetPlayer: "tester-1",
      };
      const event: GameEvent = {
        event: GameEventType.BLOCK_ACTION,
        user: "tester-1",
        data: { card },
      };
      blockAction(state, event, Sinon.stub());
      assert.deepEqual(state.blockAction, event);
    });
  });

  it("should not allow blocking stealing with cards other than ambassador/captain", function () {
    const state = generateStateWithNPlayers(2);
    assert.strictEqual(state.currentPlayer.name, "tester-0");
    state.currentAction = {
      action: GameActionMove.STEAL,
      targetPlayer: "tester-1",
    };
    ALL_CARDS.filter(
      (card) => ![Card.AMBASSADOR, Card.CAPTAIN].includes(card)
    ).forEach((card) => {
      const event: GameEvent = {
        event: GameEventType.BLOCK_ACTION,
        user: "tester-1",
        data: { card },
      };
      assert.throws(function () {
        blockAction(state, event, Sinon.stub());
      }, "requires ambassador or captain");
      assert.isUndefined(state.blockAction);
    });
  });

  it("should not allow blocking non-blockable actions", function () {
    const state = generateStateWithNPlayers(2);
    ALL_GAME_ACTION_MOVES.filter(
      (action) => !BLOCKABLE_ACTIONS.includes(action)
    ).forEach((action) => {
      state.currentAction = { action };
      const event: GameEvent = {
        event: GameEventType.BLOCK_ACTION,
        user: "tester-1",
        data: { card: Card.ASSASSIN }, // doesn't really matter which card
      };
      assert.throws(function () {
        blockAction(state, event, Sinon.stub());
      }, "cannot block non-blockable action");
      assert.isUndefined(state.blockAction);
    });
  });

  it("shouldn't allow blocking if GameStatus is not ACTION_SELECTED", function () {
    const state = generateStateWithNPlayers(3);
    Sinon.replace(state, "getStatus", () => GameStatus.AWAITING_ACTION);
    const event: GameEvent = {
      event: GameEventType.BLOCK_ACTION,
      user: "tester-2",
      data: { card: Card.AMBASSADOR },
    };
    assert.throws(function () {
      blockAction(state, event, Sinon.stub());
    }, "blockAction only valid when status = ACTION_SELECTED");
  });

  it("should throw error if missing card to block with", function () {
    const state = generateStateWithNPlayers(3);
    state.currentAction = {
      action: GameActionMove.STEAL,
      targetPlayer: "tester-1",
    };
    const event: GameEvent = {
      event: GameEventType.BLOCK_ACTION,
      user: "tester-1",
    };
    assert.throws(function () {
      blockAction(state, event, Sinon.stub());
    }, "Missing card to block with");
    assert.isUndefined(state.blockAction);
  });

  it("should send event to all users if event passes validation", function () {
    const mockMessageAllFn = Sinon.stub();
    const state = generateStateWithNPlayers(2);
    assert.strictEqual(state.currentPlayer.name, "tester-0");
    state.currentAction = {
      action: GameActionMove.ASSASSINATE,
      targetPlayer: "tester-1",
    };
    const event: GameEvent = {
      event: GameEventType.BLOCK_ACTION,
      user: "tester-1",
      data: { card: Card.CONTESSA },
    };
    blockAction(state, event, mockMessageAllFn);
    Sinon.assert.calledOnceWithExactly(
      mockMessageAllFn,
      Sinon.match.any,
      event
    );
  });
});
