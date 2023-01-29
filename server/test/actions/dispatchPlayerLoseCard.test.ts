import { assert } from "chai";
import { dispatchPlayerLoseCard } from "../../src/actions/dispatchPlayerLoseCard";
import { GameEventType } from "../../../shared/enums";
import { generateStateWithNPlayers } from "../testHelpers/stateGenerators";

import Sinon from "sinon";

describe("dispatchPlayerLoseCard action handler", function () {
  it("should set currentSecondaryPlayer to be targetPlayer", function () {
    const state = generateStateWithNPlayers(3);

    dispatchPlayerLoseCard(
      state,
      "tester-1",
      Sinon.stub(),
      "sad day you lose a card"
    );

    assert.equal(state.currentSecondaryPlayerId, 1);
    assert.equal(state.currentSecondaryPlayer.name, "tester-1");
  });

  it("should not be allowed when there is already a currentSecondaryPlayer", function () {
    const state = generateStateWithNPlayers(3);
    state.setCurrentSecondaryPlayerByName("tester-1");

    assert.throws(function () {
      dispatchPlayerLoseCard(
        state,
        "tester-2",
        Sinon.stub(),
        "sad day you lose a card"
      );
    });
  });

  it("should alert player losing card", function () {
    const state = generateStateWithNPlayers(3);
    const messagePlayer = Sinon.fake();

    dispatchPlayerLoseCard(
      state,
      "tester-1",
      messagePlayer,
      "sad day you lose a card"
    );

    Sinon.assert.calledOnceWithExactly(messagePlayer, "tester-1", {
      event: GameEventType.PLAYER_LOSE_CARD,
      user: "__server",
      data: { reason: "sad day you lose a card" },
    });
  });
});
