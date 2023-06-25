import { assert } from "chai";
import { dispatchPlayerLoseCard } from "../../src/actions/dispatchPlayerLoseCard";
import { GameStatus } from "../../../shared/enums";
import { generateStateWithNPlayers } from "../testHelpers/stateGenerators";
import Sinon from "sinon";
import { Card } from "../../../shared/Card";
import { Player } from "../../src/Player";

describe("dispatchPlayerLoseCard action", function () {
  it("should set playerLosingCard to be targetPlayer", function () {
    const state = generateStateWithNPlayers(3);

    dispatchPlayerLoseCard(
      state,
      "tester-1",
      "sad day you lose a card",
      Sinon.stub()
    );

    assert.equal(state.playerLosingCard?.player, "tester-1");
    assert.equal(state.playerLosingCard?.reason, "sad day you lose a card");
  });

  it("should not be allowed when there is already a player losing a card", function () {
    const state = generateStateWithNPlayers(3);
    Sinon.replaceGetter(state, "status", () => GameStatus.PLAYER_LOSING_CARD);
    state.playerLosingCard = { player: "tester-1", reason: "idk" };

    assert.throws(function () {
      dispatchPlayerLoseCard(
        state,
        "tester-2",
        "sad day you lose a card",
        Sinon.stub()
      );
    }, "already losing a card");
  });

  it("shouldn't allow players that don't exist to lose a card", function () {
    const state = generateStateWithNPlayers(3);

    assert.throws(function () {
      dispatchPlayerLoseCard(
        state,
        "doesnt_exist",
        "sad day you lose a card",
        Sinon.stub()
      );
    }, "could not find player doesnt_exist");
  });

  it("should send alert to all players with details", function () {
    const state = generateStateWithNPlayers(3);
    const mockMessageAllPlayerFn = Sinon.stub();

    dispatchPlayerLoseCard(
      state,
      "tester-0",
      "here lose a card dude",
      mockMessageAllPlayerFn
    );

    Sinon.assert.calledOnce(mockMessageAllPlayerFn);
    const call = mockMessageAllPlayerFn.getCall(0).args[0];
    const expectedEvent = {
      data: {
        reason: "here lose a card dude",
        targetPlayer: "tester-0",
      },
      event: "PLAYER_LOSE_CARD",
      user: "__server",
    };
    assert.deepEqual(call, expectedEvent as any);
  });

  it("should not allow a player who's out of the game", function () {
    const state = generateStateWithNPlayers(2);
    const unluckyPlayer = new Player("unlucky", [
      Card.AMBASSADOR,
      Card.ASSASSIN,
    ]);
    unluckyPlayer.revealCard(Card.ASSASSIN);
    unluckyPlayer.revealCard(Card.AMBASSADOR);
    state.addPlayer(unluckyPlayer);

    assert.throws(function () {
      dispatchPlayerLoseCard(
        state,
        "unlucky",
        "he is just unlucky",
        Sinon.stub()
      );
    }, "unlucky is out of the game");
  });
});
