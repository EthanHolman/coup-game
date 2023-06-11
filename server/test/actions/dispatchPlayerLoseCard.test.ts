import { assert } from "chai";
import { dispatchPlayerLoseCard } from "../../src/actions/dispatchPlayerLoseCard";
import { GameStatus } from "../../../shared/enums";
import { generateStateWithNPlayers } from "../testHelpers/stateGenerators";

import Sinon from "sinon";

describe("dispatchPlayerLoseCard action", function () {
  it("should set playerLosingCard to be targetPlayer", function () {
    const state = generateStateWithNPlayers(3);

    dispatchPlayerLoseCard(state, "tester-1", "sad day you lose a card");

    assert.equal(state.playerLosingCard?.player, "tester-1");
    assert.equal(state.playerLosingCard?.reason, "sad day you lose a card");
  });

  it("should not be allowed when there is already a player losing a card", function () {
    const state = generateStateWithNPlayers(3);
    Sinon.replaceGetter(state, "status", () => GameStatus.PLAYER_LOSING_CARD);
    state.playerLosingCard = { player: "tester-1", reason: "idk" };

    assert.throws(function () {
      dispatchPlayerLoseCard(state, "tester-2", "sad day you lose a card");
    }, "already losing a card");
  });

  it("shouldn't allow players that don't exist to lose a card", function () {
    const state = generateStateWithNPlayers(3);

    assert.throws(function () {
      dispatchPlayerLoseCard(state, "doesnt_exist", "sad day you lose a card");
    }, "could not find player doesnt_exist");
  });
});
