import { assert } from "chai";
import { generateClientState } from "../test/stateGenerators";
import { ClientGameAction, getAvailableActions } from "./getAvailableActions";
import {
  ALL_PLAYABLE_GAME_ACTION_MOVES,
  BLOCKABLE_ACTIONS,
  CHALLENGEABLE_ACTIONS,
  GameActionMove,
  GameStatus,
  NON_TARGETED_ACTIONS,
} from "../../shared/enums";
import { GameEventType } from "../../shared/enums";
import { Card } from "../../shared/Card";
import * as module_getBlockActionAsCards from "../../shared/getBlockActionAsCards";
import Sinon from "sinon";

describe("getAvailableActions", function () {
  it("shouldn't allow any actions if the game is paused", function () {
    const state = generateClientState(2, 0, 0);
    state.isPaused = true;
    assert.isEmpty(getAvailableActions(state));
  });

  it("shouldn't allow any actions during pre-game", function () {
    const state = generateClientState(2, 0, 0);
    state.status = GameStatus.PRE_GAME;
    assert.isEmpty(getAvailableActions(state));
  });

  describe("if isMyTurn", function () {
    it("should allow free actions regardless of coin balance", function () {
      const state = generateClientState(2, 0, 0);
      const result = getAvailableActions(state);
      assert.sameMembers(
        result.map((x) => x.action),
        [
          GameActionMove.EXCHANGE,
          GameActionMove.FOREIGN_AID,
          GameActionMove.INCOME,
          GameActionMove.STEAL,
          GameActionMove.TAX,
        ]
      );
    });

    it("should allow assassinate if they have 3 or more coins", function () {
      const state = generateClientState(2, 0, 0);
      assert.isTrue(state.thisPlayer.coins < 3);
      assert.notInclude(
        getAvailableActions(state).map((x) => x.action),
        GameActionMove.ASSASSINATE
      );
      state.thisPlayer.coins = 3;
      assert.include(
        getAvailableActions(state).map((x) => x.action),
        GameActionMove.ASSASSINATE
      );
      state.thisPlayer.coins = 7;
      assert.include(
        getAvailableActions(state).map((x) => x.action),
        GameActionMove.ASSASSINATE
      );
    });

    it("should allow coup if they have 7 or more coins", function () {
      const state = generateClientState(2, 0, 0);
      assert.isTrue(state.thisPlayer.coins < 7);
      assert.notInclude(
        getAvailableActions(state).map((x) => x.action),
        GameActionMove.COUP
      );
      state.thisPlayer.coins = 7;
      assert.include(
        getAvailableActions(state).map((x) => x.action),
        GameActionMove.COUP
      );
      state.thisPlayer.coins = 8;
      assert.include(
        getAvailableActions(state).map((x) => x.action),
        GameActionMove.COUP
      );
    });

    it("should not allow any actions besides coup if they have 10 or more coins", function () {
      const state = generateClientState(2, 0, 0);
      state.thisPlayer.coins = 10;
      assert.sameMembers(
        getAvailableActions(state).map((x) => x.action),
        [GameActionMove.COUP]
      );
    });

    it("should allow accept or challenge block", function () {
      const state = generateClientState(2, 0, 0, GameStatus.ACTION_BLOCKED);
      assert.sameMembers(
        getAvailableActions(state).map((x) => x.action),
        [GameEventType.ACCEPT_BLOCK, GameEventType.CHALLENGE_BLOCK]
      );
    });

    it("should not allow blocking own action", function () {
      const state = generateClientState(2, 0, 0, GameStatus.ACTION_SELECTED);
      assert.notInclude(
        getAvailableActions(state).map((x) => x.action),
        GameEventType.BLOCK_ACTION
      );
    });

    it("should allow confirming action if currentAction is non-targeted", function () {
      NON_TARGETED_ACTIONS.forEach((action) => {
        const state = generateClientState(2, 0, 0, GameStatus.ACTION_SELECTED);
        state.currentAction = { action };
        assert.deepInclude(
          getAvailableActions(state),
          new ClientGameAction(GameEventType.CONFIRM_ACTION, true)
        );
      });
    });
  });

  describe("if not isMyTurn", function () {
    it("should not allow any actions if status is AWAITING_ACTION", function () {
      const state = generateClientState(2, 0, 1);
      assert.isEmpty(getAvailableActions(state));
    });

    it("should only allow challenging block if status is ACTION_BLOCKED", function () {
      const state = generateClientState(3, 0, 2, GameStatus.ACTION_BLOCKED);
      assert.sameMembers(
        getAvailableActions(state).map((x) => x.action),
        [GameEventType.CHALLENGE_BLOCK]
      );
    });

    it("should allow blocking blockable actions", function () {
      const stub = Sinon.stub(
        module_getBlockActionAsCards,
        "getBlockActionAsCards"
      ).returns([Card.CAPTAIN]);

      assert.isNotEmpty(BLOCKABLE_ACTIONS);
      BLOCKABLE_ACTIONS.forEach((action) => {
        const state = generateClientState(3, 0, 2, GameStatus.ACTION_SELECTED);
        state.currentAction = {
          action,
          targetPlayer: "player-1",
        };

        const results = getAvailableActions(state);

        const blockActionResult = results.find(
          (x) => x.action === GameEventType.BLOCK_ACTION
        );
        assert.strictEqual(
          blockActionResult?.action,
          GameEventType.BLOCK_ACTION
        );
        assert.sameMembers(blockActionResult?.blockAsCards!, [Card.CAPTAIN]);
      });

      stub.restore();
    });

    it("should not allow blocking non-blockable actions", function () {
      ALL_PLAYABLE_GAME_ACTION_MOVES.filter(
        (x) => !BLOCKABLE_ACTIONS.includes(x)
      ).forEach((action) => {
        const state = generateClientState(3, 0, 2, GameStatus.ACTION_SELECTED);
        state.currentAction = {
          action,
          targetPlayer: "player-1",
        };
        assert.notInclude(
          getAvailableActions(state).map((x) => x.action),
          GameEventType.BLOCK_ACTION
        );
      });
    });

    it("should allow challenging currentAction if it is challengeable", function () {
      assert.isNotEmpty(CHALLENGEABLE_ACTIONS);
      CHALLENGEABLE_ACTIONS.forEach((action) => {
        const state = generateClientState(3, 0, 2, GameStatus.ACTION_SELECTED);
        state.currentAction = {
          action,
          targetPlayer: "player-1",
        };
        assert.include(
          getAvailableActions(state).map((x) => x.action),
          GameEventType.CHALLENGE_ACTION
        );
      });
    });

    it("should not allow challenging non-challengeable actions", function () {
      ALL_PLAYABLE_GAME_ACTION_MOVES.filter(
        (x) => !CHALLENGEABLE_ACTIONS.includes(x)
      ).forEach((action) => {
        const state = generateClientState(3, 0, 2, GameStatus.ACTION_SELECTED);
        state.currentAction = {
          action,
          targetPlayer: "player-1",
        };
        assert.notInclude(
          getAvailableActions(state).map((x) => x.action),
          GameEventType.CHALLENGE_ACTION
        );
      });
    });

    it("should allow confirming currentAction if target is thisPlayer", function () {
      const state = generateClientState(3, 1, 0, GameStatus.ACTION_SELECTED);
      state.currentAction = {
        action: GameActionMove.ASSASSINATE,
        targetPlayer: "player-0",
      };
      assert.include(
        getAvailableActions(state).map((x) => x.action),
        GameEventType.CONFIRM_ACTION
      );
    });

    it("should NOT allow confirming currentAction by other players", function () {
      const state = generateClientState(3, 1, 1, GameStatus.ACTION_SELECTED);
      state.currentAction = {
        action: GameActionMove.ASSASSINATE,
        targetPlayer: "player-0",
      };
      assert.notInclude(
        getAvailableActions(state).map((x) => x.action),
        GameEventType.CONFIRM_ACTION
      );
    });
  });

  it("should allow everyone except blocker to challenge a block", function () {
    for (let i = 1; i < 3; i++) {
      const state = generateClientState(3, 1, i, GameStatus.ACTION_BLOCKED);
      state.blockAction = {
        event: GameEventType.BLOCK_ACTION,
        user: "player-0",
        data: { card: Card.CAPTAIN },
      };
      assert.include(
        getAvailableActions(state).map((x) => x.action),
        GameEventType.CHALLENGE_BLOCK
      );
    }
  });

  it("shouldn't allow blocker to challenge their own block", function () {
    const state = generateClientState(3, 1, 0, GameStatus.ACTION_BLOCKED);
    state.blockAction = {
      event: GameEventType.BLOCK_ACTION,
      user: "player-0",
      data: { card: Card.CAPTAIN },
    };
    assert.notInclude(
      getAvailableActions(state).map((x) => x.action),
      GameEventType.CHALLENGE_BLOCK
    );
  });

  it("should not allow accepting block by non-current players", function () {
    const player2State = generateClientState(
      3,
      0,
      2,
      GameStatus.ACTION_BLOCKED
    );
    player2State.blockAction = {
      event: GameEventType.BLOCK_ACTION,
      user: "player-1",
      data: { card: Card.CONTESSA },
    };
    const player1State = generateClientState(
      3,
      0,
      1,
      GameStatus.ACTION_BLOCKED
    );
    player2State.blockAction = {
      event: GameEventType.BLOCK_ACTION,
      user: "player-1",
      data: { card: Card.CONTESSA },
    };
    assert.notInclude(
      getAvailableActions(player2State).map((x) => x.action),
      GameEventType.ACCEPT_BLOCK
    );
    assert.notInclude(
      getAvailableActions(player1State).map((x) => x.action),
      GameEventType.ACCEPT_BLOCK
    );
  });
});
