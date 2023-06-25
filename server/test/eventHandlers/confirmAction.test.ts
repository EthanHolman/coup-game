import Sinon from "sinon";
import { confirmAction } from "../../src/eventHandlers/confirmAction";
import * as dispatchPlayerLoseCard_all from "../../src/actions/dispatchPlayerLoseCard";
import * as module_nextTurn from "../../src/actions/nextTurn";
import { generateStateWithNPlayers } from "../testHelpers/stateGenerators";
import { assert } from "chai";
import {
  GameActionMove,
  GameEventType,
  GameStatus,
} from "../../../shared/enums";
import { GameEvent } from "../../../shared/GameEvent";

describe("confirmAction event handler", function () {
  let mock_nextTurn: Sinon.SinonStub;

  this.beforeEach(function () {
    mock_nextTurn = Sinon.stub(module_nextTurn, "nextTurn").returns();
  });

  this.afterEach(function () {
    mock_nextTurn.restore();
  });

  describe("assassinate/coup", function () {
    it("should trigger playerLoseCard and clear current action", function () {
      [GameActionMove.ASSASSINATE, GameActionMove.COUP].forEach((action) => {
        const state = generateStateWithNPlayers(2);
        state.currentAction = {
          action,
          targetPlayer: "tester-1",
        };
        const event: GameEvent = {
          event: GameEventType.CONFIRM_ACTION,
          user: "tester-1",
        };
        const stub_dispatchPlayerLoseCard = Sinon.stub(
          dispatchPlayerLoseCard_all,
          "dispatchPlayerLoseCard"
        ).returns();
        confirmAction(state, event, Sinon.stub());
        Sinon.assert.calledOnce(stub_dispatchPlayerLoseCard);
        assert.isUndefined(state.currentAction);
        stub_dispatchPlayerLoseCard.restore();
      });
    });
  });

  it("foreign aid should increase currentPlayers coins by 2", function () {
    const state = generateStateWithNPlayers(2);
    assert.equal(state.players.find((x) => x.name === "tester-0")?.coins, 2);
    state.currentAction = { action: GameActionMove.FOREIGN_AID };
    const event: GameEvent = {
      event: GameEventType.CONFIRM_ACTION,
      user: "tester-0",
    };
    confirmAction(state, event, Sinon.stub());
    assert.equal(state.players.find((x) => x.name === "tester-0")?.coins, 4);
  });

  it("income should increase currentPlayers coins by 1", function () {
    const state = generateStateWithNPlayers(2);
    assert.equal(state.players.find((x) => x.name === "tester-0")?.coins, 2);
    state.currentAction = { action: GameActionMove.INCOME };
    const event: GameEvent = {
      event: GameEventType.CONFIRM_ACTION,
      user: "tester-0",
    };
    confirmAction(state, event, Sinon.stub());
    assert.equal(state.players.find((x) => x.name === "tester-0")?.coins, 3);
  });

  it("tax should increase currentPlayers coins by 3", function () {
    const state = generateStateWithNPlayers(2);
    assert.equal(state.players.find((x) => x.name === "tester-0")?.coins, 2);
    state.currentAction = { action: GameActionMove.TAX };
    const event: GameEvent = {
      event: GameEventType.CONFIRM_ACTION,
      user: "tester-0",
    };
    confirmAction(state, event, Sinon.stub());
    assert.equal(state.players.find((x) => x.name === "tester-0")?.coins, 5);
  });

  describe("stealing", function () {
    it("from player with >2 coins: target should lose 2, currentplayer should gain 2", function () {
      const state = generateStateWithNPlayers(2);
      assert.equal(state.players.find((x) => x.name === "tester-0")?.coins, 2);
      state.players.find((x) => x.name === "tester-1")!.coins = 3;
      state.currentAction = {
        action: GameActionMove.STEAL,
        targetPlayer: "tester-1",
      };
      const event: GameEvent = {
        event: GameEventType.CONFIRM_ACTION,
        user: "tester-1",
      };
      confirmAction(state, event, Sinon.stub());
      assert.equal(state.players.find((x) => x.name === "tester-0")?.coins, 4);
      assert.equal(state.players.find((x) => x.name === "tester-1")?.coins, 1);
    });

    it("from player with 1 coin: target should lose 1 and currentplayer should gain 1", function () {
      const state = generateStateWithNPlayers(2);
      state.players.find((x) => x.name === "tester-1")!.coins = 1;
      assert.equal(state.players.find((x) => x.name === "tester-0")?.coins, 2);
      state.currentAction = {
        action: GameActionMove.STEAL,
        targetPlayer: "tester-1",
      };
      const event: GameEvent = {
        event: GameEventType.CONFIRM_ACTION,
        user: "tester-1",
      };
      confirmAction(state, event, Sinon.stub());
      assert.equal(state.players.find((x) => x.name === "tester-0")?.coins, 3);
      assert.equal(state.players.find((x) => x.name === "tester-1")?.coins, 0);
    });

    it("from player with 0 coins should be no-op", function () {
      const state = generateStateWithNPlayers(2);
      assert.equal(state.players.find((x) => x.name === "tester-0")?.coins, 2);
      state.players.find((x) => x.name === "tester-1")!.coins = 0;
      state.currentAction = {
        action: GameActionMove.STEAL,
        targetPlayer: "tester-1",
      };
      const event: GameEvent = {
        event: GameEventType.CONFIRM_ACTION,
        user: "tester-1",
      };
      confirmAction(state, event, Sinon.stub());
      assert.equal(state.players.find((x) => x.name === "tester-0")?.coins, 2);
      assert.equal(state.players.find((x) => x.name === "tester-1")?.coins, 0);
    });
  });

  it("should not allow targeted actions to be confirmed by others than targetPlayer", function () {
    const state = generateStateWithNPlayers(2);
    assert.equal(state.currentPlayer.name, "tester-0");
    state.currentAction = {
      action: GameActionMove.ASSASSINATE,
      targetPlayer: "tester-1",
    };
    const event: GameEvent = {
      event: GameEventType.CONFIRM_ACTION,
      user: "tester-0",
    };
    assert.throws(function () {
      confirmAction(state, event, Sinon.stub());
    }, "Wrong user");
  });

  it("should not allow non-targeted actions to be confirmed others than currentPlayer", function () {
    const state = generateStateWithNPlayers(2);
    assert.equal(state.currentPlayer.name, "tester-0");
    state.currentAction = { action: GameActionMove.TAX };
    const event: GameEvent = {
      event: GameEventType.CONFIRM_ACTION,
      user: "tester-1",
    };
    assert.throws(function () {
      confirmAction(state, event, Sinon.stub());
    }, "Wrong user");
  });

  it("should broadcast incoming event to all users", function () {
    const mockMessageAllFn = Sinon.stub();
    const state = generateStateWithNPlayers(2);
    state.currentAction = { action: GameActionMove.TAX };
    const event: GameEvent = {
      event: GameEventType.CONFIRM_ACTION,
      user: "tester-0",
    };
    confirmAction(state, event, mockMessageAllFn);
    Sinon.assert.calledOnceWithExactly(mockMessageAllFn, event);
  });

  it("should trigger next turn", function () {
    const state = generateStateWithNPlayers(2);
    state.currentAction = { action: GameActionMove.TAX };
    const event: GameEvent = {
      event: GameEventType.CONFIRM_ACTION,
      user: "tester-0",
    };
    confirmAction(state, event, Sinon.stub());
    Sinon.assert.calledOnce(mock_nextTurn);
  });

  it("should not allow confirming if GameStatus is not ACTION_SELECTED", function () {
    const state = generateStateWithNPlayers(2);
    Sinon.replaceGetter(state, "status", () => GameStatus.AWAITING_ACTION);
    const event: GameEvent = {
      event: GameEventType.CONFIRM_ACTION,
      user: "tester-0",
    };
    assert.throws(function () {
      confirmAction(state, event, Sinon.stub());
    }, "confirmAction only valid when status = ACTION_SELECTED");
  });

  it("should not broadcast event if autoConfirm is true", function () {
    const state = generateStateWithNPlayers(2);
    assert.equal(state.currentPlayer.name, "tester-0");
    state.currentAction = {
      action: GameActionMove.STEAL,
      targetPlayer: "tester-1",
    };
    const event: GameEvent = {
      event: GameEventType.CONFIRM_ACTION,
      user: "tester-1",
    };
    const mockMessageAllFn = Sinon.stub();
    confirmAction(state, event, mockMessageAllFn, true);
    Sinon.assert.notCalled(mockMessageAllFn);
  });

  it("should bypass targeted player checks if autoConfirm is true", function () {
    const state = generateStateWithNPlayers(2);
    assert.equal(state.currentPlayer.name, "tester-0");
    state.currentAction = {
      action: GameActionMove.ASSASSINATE,
      targetPlayer: "tester-1",
    };
    const event: GameEvent = {
      event: GameEventType.CONFIRM_ACTION,
      user: "tester-0",
    };
    confirmAction(state, event, Sinon.stub(), true);
  });

  it("should bypass nontargeted player checks if autoConfirm is true", function () {
    const state = generateStateWithNPlayers(2);
    assert.equal(state.currentPlayer.name, "tester-0");
    state.currentAction = { action: GameActionMove.TAX };
    const event: GameEvent = {
      event: GameEventType.CONFIRM_ACTION,
      user: "tester-1",
    };
    confirmAction(state, event, Sinon.stub(), true);
  });
});
