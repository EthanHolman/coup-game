import Sinon from "sinon";
import { GameActionMove, GameEventType } from "../../src/enums";
import { confirmAction } from "../../src/eventHandlers/confirmAction";
import { GameState } from "../../src/GameState";
import { GameEvent } from "../../src/types";
import * as dispatchPlayerLoseCard_all from "../../src/actions/dispatchPlayerLoseCard";
import { generateStateWithNPlayers } from "../testHelpers/stateGenerators";
import { assert } from "chai";

describe("confirmAction event handler", function () {
  it("assassinate should trigger playerLoseCard and clear current action", function () {
    const state = generateStateWithNPlayers(2);
    state.currentAction = {
      action: GameActionMove.ASSASSINATE,
      targetPlayer: "tester-1",
    };
    const event: GameEvent = {
      event: GameEventType.CONFIRM_ACTION,
      user: "tester-0",
    };
    const stub_dispatchPlayerLoseCard = Sinon.stub(
      dispatchPlayerLoseCard_all,
      "dispatchPlayerLoseCard"
    ).returns();
    const messagePlayerFn = Sinon.stub();
    confirmAction(state, event, Sinon.stub(), messagePlayerFn);
    Sinon.assert.calledOnceWithExactly(
      stub_dispatchPlayerLoseCard,
      state,
      "tester-1",
      GameActionMove.ASSASSINATE,
      messagePlayerFn
    );
    assert.isUndefined(state.currentAction);
    stub_dispatchPlayerLoseCard.restore();
  });

  it("coup should trigger playerLoseCard and clear current action", function () {
    const state = generateStateWithNPlayers(2);
    state.currentAction = {
      action: GameActionMove.COUP,
      targetPlayer: "tester-1",
    };
    const event: GameEvent = {
      event: GameEventType.CONFIRM_ACTION,
      user: "tester-0",
    };
    const stub_dispatchPlayerLoseCard = Sinon.stub(
      dispatchPlayerLoseCard_all,
      "dispatchPlayerLoseCard"
    ).returns();
    const messagePlayerFn = Sinon.stub();
    confirmAction(state, event, Sinon.stub(), messagePlayerFn);
    Sinon.assert.calledOnceWithExactly(
      stub_dispatchPlayerLoseCard,
      state,
      "tester-1",
      GameActionMove.COUP,
      messagePlayerFn
    );
    assert.isUndefined(state.currentAction);
    stub_dispatchPlayerLoseCard.restore();
  });

  // TODO: add exchange confirm tests
  // it('exchange should....', function() {})

  it("foreign aid should increase currentPlayers coins by 2", function () {});

  it("income should increase currentPlayers coins by 1", function () {});

  it("stealing from player with 2+ coins -- target should lose 2 and currentplayer should gain 2", function () {});

  it("stealing from player with <2 coins -- target should lose 1 and currentplayer should gain 1", function () {});

  it("tax should increase currentPlayers coins by 3", function () {});

  it("confirmations from non-current players should not be allowed", function () {});

  // TODO: add tests for confirmation events
  // it('', function() {})
});
