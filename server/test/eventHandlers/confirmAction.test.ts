import Sinon from "sinon";
import { confirmAction } from "../../src/eventHandlers/confirmAction";
import * as dispatchPlayerLoseCard_all from "../../src/actions/dispatchPlayerLoseCard";
import * as nextTurn_all from "../../src/actions/nextTurn";
import { generateStateWithNPlayers } from "../testHelpers/stateGenerators";
import { assert } from "chai";
import {
  GameActionMove,
  GameEventType,
  GameStatus,
} from "../../../shared/enums";
import { GameEvent } from "../../../shared/GameEvent";

describe("confirmAction event handler", function () {
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
        const messagePlayerFn = Sinon.stub();
        confirmAction(state, event, Sinon.stub(), messagePlayerFn);
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
    confirmAction(state, event, Sinon.stub(), Sinon.stub());
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
    confirmAction(state, event, Sinon.stub(), Sinon.stub());
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
    confirmAction(state, event, Sinon.stub(), Sinon.stub());
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
      confirmAction(state, event, Sinon.stub(), Sinon.stub());
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
      confirmAction(state, event, Sinon.stub(), Sinon.stub());
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
      confirmAction(state, event, Sinon.stub(), Sinon.stub());
      assert.equal(state.players.find((x) => x.name === "tester-0")?.coins, 2);
      assert.equal(state.players.find((x) => x.name === "tester-1")?.coins, 0);
    });
  });

  it("should not allow confirms by the wrong users", function () {
    // maybe::: "targeted actions should only be confirmable by target player"
    //    and "non-targeted actions should only be confirmable by current player"
  });

  it("should broadcast incoming event to all users", function () {
    const mockMessageAllFn = Sinon.stub();
    const state = generateStateWithNPlayers(2);
    state.currentAction = { action: GameActionMove.TAX };
    const event: GameEvent = {
      event: GameEventType.CONFIRM_ACTION,
      user: "tester-0",
    };
    confirmAction(state, event, mockMessageAllFn, Sinon.stub());
    Sinon.assert.calledOnceWithExactly(mockMessageAllFn, event);
  });

  it("should trigger next turn", function () {
    const stub_nextTurn = Sinon.stub(nextTurn_all, "nextTurn").returns();
    const state = generateStateWithNPlayers(2);
    state.currentAction = { action: GameActionMove.TAX };
    const event: GameEvent = {
      event: GameEventType.CONFIRM_ACTION,
      user: "tester-0",
    };
    confirmAction(state, event, Sinon.stub(), Sinon.stub());
    Sinon.assert.calledOnce(stub_nextTurn);
    stub_nextTurn.restore();
  });

  it("should not allow confirming if GameStatus is not ACTION_SELECTED", function () {
    const state = generateStateWithNPlayers(2);
    Sinon.replaceGetter(state, "status", () => GameStatus.AWAITING_ACTION);
    const event: GameEvent = {
      event: GameEventType.CONFIRM_ACTION,
      user: "tester-0",
    };
    assert.throws(function () {
      confirmAction(state, event, Sinon.stub(), Sinon.stub());
    }, "confirmAction only valid when status = ACTION_SELECTED");
  });
});
