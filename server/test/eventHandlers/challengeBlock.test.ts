import { assert } from "chai";
import {
  GameActionMove,
  GameEventType,
  GameStatus,
} from "../../../shared/enums";
import { generateStateWithNPlayers } from "../testHelpers/stateGenerators";
import { challengeBlock } from "../../src/eventHandlers/challengeBlock";
import { GameEvent } from "../../../shared/GameEvent";
import Sinon from "sinon";
import { Card } from "../../../shared/Card";
import { GameState } from "../../src/GameState";
import { Player } from "../../src/Player";
import * as module_dispatchPlayerLoseCard from "../../src/actions/dispatchPlayerLoseCard";
import * as module_givePlayerNewCard from "../../src/actions/givePlayerNewCard";

describe("challengeBlock event handler", function () {
  let mock_dispatchPlayerLoseCard: Sinon.SinonStub;
  let mock_givePlayerNewCard: Sinon.SinonStub;

  this.beforeEach(function () {
    mock_dispatchPlayerLoseCard = Sinon.stub(
      module_dispatchPlayerLoseCard,
      "dispatchPlayerLoseCard"
    ).returns();
    mock_givePlayerNewCard = Sinon.stub(
      module_givePlayerNewCard,
      "givePlayerNewCard"
    ).returns();
  });

  this.afterEach(function () {
    mock_dispatchPlayerLoseCard.restore();
    mock_givePlayerNewCard.restore();
  });

  it("shouldn't allow event if GameStatus is not ACTION_BLOCKED", function () {
    const state = generateStateWithNPlayers(2);
    Sinon.replace(state, "getStatus", () => GameStatus.AWAITING_ACTION);
    const event: GameEvent = {
      event: GameEventType.CHALLENGE_BLOCK,
      user: "tester-1",
    };
    assert.throws(function () {
      challengeBlock(state, event, Sinon.stub());
    }, "challengeBlock only valid when status = ACTION_BLOCKED");
  });

  it("shouldn't allow blocker to challenge their own block", function () {
    const state = generateStateWithNPlayers(3);
    state.currentAction = {
      action: GameActionMove.ASSASSINATE,
      targetPlayer: "tester-1",
    };
    state.blockAction = {
      event: GameEventType.BLOCK_ACTION,
      user: "tester-1",
      data: { card: Card.CONTESSA },
    };
    const event: GameEvent = {
      event: GameEventType.CHALLENGE_BLOCK,
      user: "tester-1",
    };
    assert.throws(function () {
      challengeBlock(state, event, Sinon.stub());
    }, "cannot challenge your own block");
  });

  describe("if blockEvent.user has required card", function () {
    function buildMockState(): GameState {
      const state = new GameState();
      state.addPlayer(
        new Player("tester-0", [Card.AMBASSADOR, Card.ASSASSIN], true)
      );
      state.addPlayer(new Player("tester-1", [Card.CAPTAIN, Card.ASSASSIN]));
      state.start();
      state.currentAction = {
        action: GameActionMove.STEAL,
        targetPlayer: "tester-1",
      };
      state.blockAction = {
        event: GameEventType.BLOCK_ACTION,
        user: "tester-1",
        data: { card: Card.CAPTAIN },
      };
      return state;
    }

    it("should trigger the block challenger to lose a card", function () {
      const state = buildMockState();
      const event: GameEvent = {
        event: GameEventType.CHALLENGE_BLOCK,
        user: "tester-0",
      };

      challengeBlock(state, event, Sinon.stub());

      Sinon.assert.calledOnceWithExactly(
        mock_dispatchPlayerLoseCard,
        Sinon.match.any,
        "tester-0",
        Sinon.match("You failed the challenge"),
        Sinon.match.any
      );
    });

    it("should trigger blocking player to replace their blockAs card with new one from deck", function () {
      const state = buildMockState();
      const event: GameEvent = {
        event: GameEventType.CHALLENGE_BLOCK,
        user: "tester-0",
      };

      challengeBlock(state, event, Sinon.stub());

      Sinon.assert.calledOnceWithExactly(
        mock_givePlayerNewCard,
        Sinon.match.any,
        Sinon.match.has("name", "tester-1"),
        Card.CAPTAIN
      );
    });

    it("should clear currentAction", function () {
      const state = buildMockState();
      const event: GameEvent = {
        event: GameEventType.CHALLENGE_BLOCK,
        user: "tester-0",
      };

      challengeBlock(state, event, Sinon.stub());

      assert.isUndefined(state.currentAction);
    });
  });

  describe("if blockEvent.user DOES NOT have required card", function () {
    function buildMockState(): GameState {
      const state = new GameState();
      state.addPlayer(
        new Player("tester-0", [Card.AMBASSADOR, Card.ASSASSIN], true)
      );
      state.addPlayer(new Player("tester-1", [Card.CONTESSA, Card.ASSASSIN]));
      state.start();
      state.currentAction = {
        action: GameActionMove.STEAL,
        targetPlayer: "tester-1",
      };
      state.blockAction = {
        event: GameEventType.BLOCK_ACTION,
        user: "tester-1",
        data: { card: Card.CAPTAIN },
      };
      return state;
    }

    it("should trigger blockEvent.user to lose a card", function () {
      const state = buildMockState();
      const event: GameEvent = {
        event: GameEventType.CHALLENGE_BLOCK,
        user: "tester-0",
      };

      challengeBlock(state, event, Sinon.stub());

      Sinon.assert.calledOnceWithExactly(
        mock_dispatchPlayerLoseCard,
        Sinon.match.any,
        "tester-1",
        Sinon.match("You were caught bluffing"),
        Sinon.match.any
      );
    });
  });
});
