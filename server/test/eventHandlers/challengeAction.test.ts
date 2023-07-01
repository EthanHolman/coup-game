import Sinon from "sinon";
import { generateStateWithNPlayers } from "../testHelpers/stateGenerators";
import {
  GameActionMove,
  GameEventType,
  GameStatus,
} from "../../../shared/enums";
import { challengeAction } from "../../src/eventHandlers/challengeAction";
import { GameEvent } from "../../../shared/GameEvent";
import { assert } from "chai";
import { GameState } from "../../src/GameState";
import { Player } from "../../src/Player";
import { Card } from "../../../shared/Card";
import * as module_dispatchPlayerLoseCard from "../../src/actions/dispatchPlayerLoseCard";
import * as module_givePlayerNewCard from "../../src/actions/givePlayerNewCard";

describe("challengeAction event handler", function () {
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

  it("should not allow event if GameState is not ACTION_SELECTED", function () {
    const state = generateStateWithNPlayers(2);
    Sinon.replace(state, "getStatus", () => GameStatus.AWAITING_ACTION);

    const event: GameEvent = {
      event: GameEventType.CHALLENGE_ACTION,
      user: "tester-1",
    };

    assert.throws(function () {
      challengeAction(state, event, Sinon.stub());
    }, "only valid when status = ACTION_SELECTED");
  });

  it("should not be allowed by current player", function () {
    const state = generateStateWithNPlayers(2);
    assert.strictEqual(state.currentPlayer.name, "tester-0");
    Sinon.replace(state, "getStatus", () => GameStatus.ACTION_SELECTED);
    state.currentAction = { action: GameActionMove.STEAL };

    const event: GameEvent = {
      event: GameEventType.CHALLENGE_ACTION,
      user: "tester-0",
    };

    assert.throws(function () {
      challengeAction(state, event, Sinon.stub());
    }, "cannot challenge your own action");
  });

  it("should trigger challenger to lose a card if current player has required card", function () {
    const state = new GameState();
    state.addPlayer(
      new Player("tester-0", [Card.AMBASSADOR, Card.CAPTAIN], true)
    );
    state.addPlayer(new Player("tester-1", [Card.AMBASSADOR, Card.CONTESSA]));
    state.start();
    Sinon.replace(state, "getStatus", () => GameStatus.ACTION_SELECTED);

    state.currentAction = {
      action: GameActionMove.STEAL,
      targetPlayer: "tester-1",
    };

    const event: GameEvent = {
      event: GameEventType.CHALLENGE_ACTION,
      user: "tester-1",
    };

    challengeAction(state, event, Sinon.stub());

    Sinon.assert.calledOnceWithExactly(
      mock_dispatchPlayerLoseCard,
      Sinon.match.any,
      "tester-1",
      Sinon.match.any,
      Sinon.match.any
    );
  });

  it("should trigger current player to replace their card with new one", function () {
    const state = new GameState();
    const player0 = new Player(
      "tester-0",
      [Card.AMBASSADOR, Card.CAPTAIN],
      true
    );
    state.addPlayer(player0);
    state.addPlayer(new Player("tester-1", [Card.AMBASSADOR, Card.CONTESSA]));
    state.start();
    Sinon.replace(state, "getStatus", () => GameStatus.ACTION_SELECTED);

    state.currentAction = {
      action: GameActionMove.STEAL,
      targetPlayer: "tester-1",
    };

    const event: GameEvent = {
      event: GameEventType.CHALLENGE_ACTION,
      user: "tester-1",
    };

    challengeAction(state, event, Sinon.stub());

    Sinon.assert.calledOnceWithExactly(
      mock_givePlayerNewCard,
      Sinon.match.any,
      player0,
      Card.CAPTAIN
    );
  });

  it("should trigger current player to lose a card if they dont have required card", function () {
    const state = new GameState();
    state.addPlayer(
      new Player("tester-0", [Card.AMBASSADOR, Card.CONTESSA], true)
    );
    state.addPlayer(new Player("tester-1", [Card.AMBASSADOR, Card.CONTESSA]));
    state.start();
    Sinon.replace(state, "getStatus", () => GameStatus.ACTION_SELECTED);

    state.currentAction = {
      action: GameActionMove.STEAL,
      targetPlayer: "tester-1",
    };

    const event: GameEvent = {
      event: GameEventType.CHALLENGE_ACTION,
      user: "tester-1",
    };

    challengeAction(state, event, Sinon.stub());

    Sinon.assert.calledOnceWithExactly(
      mock_dispatchPlayerLoseCard,
      Sinon.match.any,
      "tester-0",
      Sinon.match.any,
      Sinon.match.any
    );
  });

  it("should clear currentAction if currentPlayer doesn't have required card for action", function () {
    const state = new GameState();
    state.addPlayer(
      new Player("tester-0", [Card.AMBASSADOR, Card.CONTESSA], true)
    );
    state.addPlayer(new Player("tester-1", [Card.AMBASSADOR, Card.CONTESSA]));
    state.start();
    Sinon.replace(state, "getStatus", () => GameStatus.ACTION_SELECTED);

    state.currentAction = {
      action: GameActionMove.STEAL,
      targetPlayer: "tester-1",
    };

    const event: GameEvent = {
      event: GameEventType.CHALLENGE_ACTION,
      user: "tester-1",
    };

    challengeAction(state, event, Sinon.stub());

    assert.isUndefined(state.currentAction);
  });

  it("should alert all users of the challenge", function () {
    const mockMessageAllFn = Sinon.stub();
    const state = new GameState();
    state.addPlayer(
      new Player("tester-0", [Card.AMBASSADOR, Card.CAPTAIN], true)
    );
    state.addPlayer(new Player("tester-1", [Card.AMBASSADOR, Card.CONTESSA]));
    state.start();
    Sinon.replace(state, "getStatus", () => GameStatus.ACTION_SELECTED);

    state.currentAction = {
      action: GameActionMove.STEAL,
      targetPlayer: "tester-1",
    };

    const event: GameEvent = {
      event: GameEventType.CHALLENGE_ACTION,
      user: "tester-1",
    };

    challengeAction(state, event, mockMessageAllFn);

    Sinon.assert.calledOnceWithExactly(mockMessageAllFn, event);
  });
});
