import Sinon from "sinon";
import { GameEvent } from "../../src/types";
import {
  GameEventType,
  GameActionMove,
  ALL_PLAYABLE_GAME_ACTION_MOVES,
} from "../../src/enums";
import { chooseAction } from "../../src/eventHandlers/chooseAction";
import { assert } from "chai";
import { generateStateWithNPlayers } from "../testHelpers/stateGenerators";
import { GameState } from "../../src/GameState";
import { Player } from "../../src/Player";
import { Card } from "../../src/Deck";

describe("chooseAction event handler", function () {
  it("should set the current action", function () {
    const state = generateStateWithNPlayers(2);
    const event: GameEvent = {
      event: GameEventType.CHOOSE_ACTION,
      user: "tester-0",
      data: { action: GameActionMove.EXCHANGE },
    };
    chooseAction(state, event, Sinon.stub());
    assert.deepEqual(state.currentAction, { action: GameActionMove.EXCHANGE });
  });

  it("should relay event to all players", function () {
    const state = generateStateWithNPlayers(2);
    const event: GameEvent = {
      event: GameEventType.CHOOSE_ACTION,
      user: "tester-0",
      data: { action: GameActionMove.EXCHANGE },
    };
    const messageAllFn = Sinon.fake();
    chooseAction(state, event, messageAllFn);
    Sinon.assert.calledOnceWithExactly(messageAllFn, event);
  });

  it("should not allow proposing invalid actions", function () {
    const state = generateStateWithNPlayers(2);
    [GameActionMove.NONE, GameActionMove.LOSE_CARD].forEach((invalidAction) => {
      assert.throws(function () {
        chooseAction(
          state,
          {
            event: GameEventType.CHOOSE_ACTION,
            user: "tester-0",
            data: { action: invalidAction },
          },
          Sinon.stub()
        );
      }, "not a valid action");
      assert.isUndefined(state.currentAction);
    });
  });

  it("should not allow things that arent game action moves", function () {
    const state = generateStateWithNPlayers(2);
    const partialEvent = {
      event: GameEventType.CHOOSE_ACTION,
      user: "tester-0",
    };
    assert.throws(function () {
      chooseAction(
        state,
        { ...partialEvent, data: { action: "asdf" as any } },
        Sinon.stub()
      );
    }, "not a valid action");
    assert.throws(function () {
      chooseAction(
        state,
        { ...partialEvent, data: { action: 69 as any } },
        Sinon.stub()
      );
    }, "not a valid action");
    assert.isUndefined(state.currentAction);
  });

  it("should not accept actions from non-current user", function () {
    const state = generateStateWithNPlayers(2);
    assert.equal(state.currentPlayer.name, "tester-0");
    assert.throws(function () {
      chooseAction(
        state,
        {
          event: GameEventType.CHOOSE_ACTION,
          user: "tester-1",
          data: { action: GameActionMove.INCOME },
        },
        Sinon.stub()
      );
    }, "not currently tester-1's turn");
    assert.isUndefined(state.currentAction);
  });

  it("should not allow actions if the game is not running", function () {
    const state = new GameState();
    assert.equal(state.gameStatus, "PRE_GAME");
    const event = {
      event: GameEventType.CHOOSE_ACTION,
      user: "tester-0",
      data: { action: GameActionMove.COUP, targetPlayer: "tester-1" },
    };
    assert.throws(function () {
      chooseAction(state, event, Sinon.stub());
    }, "cannot choose an action when the game is not running");
    state.pause();
    assert.throws(function () {
      chooseAction(state, event, Sinon.stub());
    }, "cannot choose an action when the game is not running");
  });

  it("should not allow actions other than COUP if player has 10 coins", function () {
    const state = generateStateWithNPlayers(2);
    state.currentPlayer.coins = 10;
    ALL_PLAYABLE_GAME_ACTION_MOVES.filter(
      (x) => x !== GameActionMove.COUP
    ).forEach((action) => {
      assert.throws(function () {
        chooseAction(
          state,
          {
            event: GameEventType.CHOOSE_ACTION,
            user: "tester-0",
            data: { action },
          },
          Sinon.stub()
        );
      }, "only valid play is to COUP");
      assert.isUndefined(state.currentAction);
    });
  });

  it("coup should be allowed with enough coins and target player", function () {
    const state = generateStateWithNPlayers(2);
    state.currentPlayer.coins = 7;
    const event = {
      event: GameEventType.CHOOSE_ACTION,
      user: "tester-0",
      data: { action: GameActionMove.COUP, targetPlayer: "tester-1" },
    };
    chooseAction(state, event, Sinon.stub());
    assert.deepEqual(state.currentAction, event.data);
  });

  it("coup should not be allowed without enough coins", function () {
    const state = generateStateWithNPlayers(2);
    assert.equal(state.currentPlayer.coins, 2);
    const event = {
      event: GameEventType.CHOOSE_ACTION,
      user: "tester-0",
      data: { action: GameActionMove.COUP, targetPlayer: "tester-1" },
    };
    assert.throws(function () {
      chooseAction(state, event, Sinon.stub());
    }, "needs at least 7 coins");
    assert.isUndefined(state.currentAction);
  });

  it("stealing allowed from another player that has at least 1 coin", function () {
    const state = generateStateWithNPlayers(2);
    const event = {
      event: GameEventType.CHOOSE_ACTION,
      user: "tester-0",
      data: { action: GameActionMove.STEAL, targetPlayer: "tester-1" },
    };
    chooseAction(state, event, Sinon.stub());
    assert.deepEqual(state.currentAction, event.data);
  });

  it("stealing not allowed from player with no coins", function () {
    const state = new GameState();
    state.addPlayer(new Player("roger", [Card.CAPTAIN, Card.CONTESSA]));
    const kody = new Player("kody", [Card.DUKE, Card.DUKE]);
    kody.coins = 0;
    state.addPlayer(kody);
    state.start();
    const event = {
      event: GameEventType.CHOOSE_ACTION,
      user: "roger",
      data: { action: GameActionMove.STEAL, targetPlayer: "kody" },
    };
    assert.throws(function () {
      chooseAction(state, event, Sinon.stub());
    }, "doesn't have enough coins to steal from");
    assert.isUndefined(state.currentAction);
  });

  it("assassination allowed if currentPlayer has enough coins", function () {
    const state = generateStateWithNPlayers(2);
    state.currentPlayer.coins = 3;
    const event = {
      event: GameEventType.CHOOSE_ACTION,
      user: "tester-0",
      data: { action: GameActionMove.ASSASSINATE, targetPlayer: "tester-1" },
    };
    chooseAction(state, event, Sinon.stub());
    assert.deepEqual(state.currentAction, event.data);
  });

  it("assassination not allowed if currentPlayer has less than 3 coins", function () {
    const state = generateStateWithNPlayers(2);
    const event = {
      event: GameEventType.CHOOSE_ACTION,
      user: "tester-0",
      data: { action: GameActionMove.ASSASSINATE, targetPlayer: "tester-1" },
    };
    assert.throws(function () {
      chooseAction(state, event, Sinon.stub());
    }, "needs at least 3 coins");
    assert.isUndefined(state.currentAction);
  });

  it("tax allowed", function () {
    const state = generateStateWithNPlayers(2);
    const event = {
      event: GameEventType.CHOOSE_ACTION,
      user: "tester-0",
      data: { action: GameActionMove.TAX },
    };
    chooseAction(state, event, Sinon.stub());
    assert.deepEqual(state.currentAction, event.data);
  });

  it("exchange allowed", function () {
    const state = generateStateWithNPlayers(2);
    const event = {
      event: GameEventType.CHOOSE_ACTION,
      user: "tester-0",
      data: { action: GameActionMove.EXCHANGE },
    };
    chooseAction(state, event, Sinon.stub());
    assert.deepEqual(state.currentAction, event.data);
  });

  it("income allowed", function () {
    const state = generateStateWithNPlayers(2);
    const event = {
      event: GameEventType.CHOOSE_ACTION,
      user: "tester-0",
      data: { action: GameActionMove.INCOME },
    };
    chooseAction(state, event, Sinon.stub());
    assert.deepEqual(state.currentAction, event.data);
  });

  it("foreign aid allowed", function () {
    const state = generateStateWithNPlayers(2);
    const event = {
      event: GameEventType.CHOOSE_ACTION,
      user: "tester-0",
      data: { action: GameActionMove.FOREIGN_AID },
    };
    chooseAction(state, event, Sinon.stub());
    assert.deepEqual(state.currentAction, event.data);
  });

  const TARGET_PLAYER_ACTIONS = [
    GameActionMove.COUP,
    GameActionMove.ASSASSINATE,
    GameActionMove.STEAL,
  ];

  // targetPlayer
  it("should not allow missing player target", function () {
    const state = generateStateWithNPlayers(2);
    TARGET_PLAYER_ACTIONS.forEach((action) => {
      assert.throws(function () {
        chooseAction(
          state,
          {
            event: GameEventType.CHOOSE_ACTION,
            user: "tester-0",
            data: { action },
          },
          Sinon.stub()
        );
      }, "missing targetPlayer");
    });
  });

  it("should not allow target as self", function () {
    const state = generateStateWithNPlayers(2);
    TARGET_PLAYER_ACTIONS.forEach((action) => {
      assert.throws(function () {
        chooseAction(
          state,
          {
            event: GameEventType.CHOOSE_ACTION,
            user: "tester-0",
            data: { action, targetPlayer: "tester-0" },
          },
          Sinon.stub()
        );
      }, "not a valid targetPlayer");
    });
  });

  it("should not allow targeting player that is out", function () {
    const state = generateStateWithNPlayers(3);
    const player = state.players.find((x) => x.name === "tester-2");
    player!.revealCard(Card.CONTESSA);
    player!.revealCard(Card.CONTESSA);
    assert.isTrue(player!.isOut);
    TARGET_PLAYER_ACTIONS.forEach((action) => {
      assert.throws(function () {
        chooseAction(
          state,
          {
            event: GameEventType.CHOOSE_ACTION,
            user: "tester-0",
            data: { action, targetPlayer: "tester-2" },
          },
          Sinon.stub()
        );
      }, "not a valid targetPlayer");
    });
  });

  it("should not allow unknown target players", function () {
    const state = generateStateWithNPlayers(2);
    TARGET_PLAYER_ACTIONS.forEach((action) => {
      assert.throws(function () {
        chooseAction(
          state,
          {
            event: GameEventType.CHOOSE_ACTION,
            user: "tester-0",
            data: { action, targetPlayer: "doesntexistplayer" },
          },
          Sinon.stub()
        );
      }, "is not a valid targetPlayer");
    });
  });
});
