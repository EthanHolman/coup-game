import { assert } from "chai";
import { dispatchPlayerLoseCard } from "../../src/actions/dispatchPlayerLoseCard";
import { GameActionMove, GameEventType } from "../../src/enums";
import { generateStateWithNPlayers } from "../testHelpers/stateGenerators";

import sinon from "sinon";

describe("dispatchPlayerLoseCard action handler", function () {
  it("should properly set state fields", function () {
    const state = generateStateWithNPlayers(3);
    state.activeAction = GameActionMove.ASSASSINATE;

    dispatchPlayerLoseCard(
      state,
      "tester-0",
      GameActionMove.ASSASSINATE,
      () => {}
    );

    assert.equal(state.activeAction, GameActionMove.LOSE_CARD);
    assert.equal(state.currentSecondaryPlayer.name, "tester-0");
  });

  it("should alert player losing card", function () {
    const messagePlayer = sinon.fake();
    const state = generateStateWithNPlayers(3);

    dispatchPlayerLoseCard(
      state,
      "tester-1",
      GameActionMove.COUP,
      messagePlayer
    );

    assert.isTrue(
      messagePlayer.calledWith("tester-1", {
        event: GameEventType.PLAYER_LOSE_CARD,
        data: { reason: GameActionMove.COUP },
      })
    );
  });
});
