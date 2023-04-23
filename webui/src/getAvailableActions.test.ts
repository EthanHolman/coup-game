import { assert } from "chai";
import { generateClientState } from "./test/stateGenerators";
import { getAvailableActions } from "./getAvailableActions";
import { GameActionMove } from "../../shared/enums";

describe("getAvailableActions", function () {
  it("shouldn't allow any actions if the game isn't running", function () {
    const state = generateClientState(2, 0, 0);
    state.gameStatus = "PAUSED";
    assert.isEmpty(getAvailableActions(state));
    state.gameStatus = "PRE_GAME";
    assert.isEmpty(getAvailableActions(state));
  });

  describe("if isMyTurn", function () {
    it("should allow free actions regardless of coin balance", function () {
      const state = generateClientState(2, 0, 0);
      const result = getAvailableActions(state);
      assert.sameMembers(result, [
        GameActionMove.EXCHANGE,
        GameActionMove.FOREIGN_AID,
        GameActionMove.INCOME,
        GameActionMove.STEAL,
        GameActionMove.TAX,
      ]);
    });

    it("should allow assassinate if they have 3 or more coins", function () {
      const state = generateClientState(2, 0, 0);
      assert.isTrue(state.thisPlayer.coins < 3);
      assert.notInclude(getAvailableActions(state), GameActionMove.ASSASSINATE);
      state.thisPlayer.coins = 3;
      assert.include(getAvailableActions(state), GameActionMove.ASSASSINATE);
      state.thisPlayer.coins = 7;
      assert.include(getAvailableActions(state), GameActionMove.ASSASSINATE);
    });

    it("should allow coup if they have 7 or more coins", function () {
      const state = generateClientState(2, 0, 0);
      assert.isTrue(state.thisPlayer.coins < 7);
      assert.notInclude(getAvailableActions(state), GameActionMove.COUP);
      state.thisPlayer.coins = 7;
      assert.include(getAvailableActions(state), GameActionMove.COUP);
      state.thisPlayer.coins = 8;
      assert.include(getAvailableActions(state), GameActionMove.COUP);
    });

    it("should not allow any actions besides coup if they have 10 or more coins", function () {
      const state = generateClientState(2, 0, 0);
      state.thisPlayer.coins = 10;
      assert.sameMembers(getAvailableActions(state), [GameActionMove.COUP]);
    });
  });

  describe("if not isMyTurn", function () {
    it("should not allow any actions if no currentAction or blockAction are present", function () {});

    it("should not allow any actions if currentAction and blockAction are present", function () {});

    it("should allow blocking if currentAction and no blockAction", function () {});

    it("should not allow blocking non-blockable actions", function () {});

    it("should allow challenging currentAction if it is challengeable", function () {});

    it("should not allow challenging non-challengeable actions", function () {});

    it("should allow confirming currentAction if target is thisPlayer", function () {});

    it("should NOT allow confirming currentAction by other players", function () {});
  });

  it("should allow accepting block if it's thisPlayer's turn", function () {});

  it("should not allow accepting block by other players", function () {});

  it("should allow everyone except blocker to challenge the block", function () {});
});
