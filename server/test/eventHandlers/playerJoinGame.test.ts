import { assert } from "chai";
import Sinon from "sinon";
import { GameEventType, GameStatus } from "../../../shared/enums";
import { Card } from "../../../shared/Card";
import { playerJoinGame } from "../../src/eventHandlers/playerJoinGame";
import { GameEvent } from "../../../shared/GameEvent";
import { GameState } from "../../src/GameState";
import { Player } from "../../src/Player";
import * as module_addNewPlayer from "../../src/actions/addNewPlayer";
import * as module_resumeGame from "../../src/actions/resumeGame";

describe("playerJoinGame event handler", function () {
  let mock_addNewPlayer: Sinon.SinonStub;

  this.beforeEach(function () {
    mock_addNewPlayer = Sinon.stub(
      module_addNewPlayer,
      "addNewPlayer"
    ).returns();
  });

  this.afterEach(function () {
    mock_addNewPlayer.restore();
  });

  it("should call addNewPlayer with new username during pregame", function () {
    const state = new GameState();
    Sinon.replace(state, "getStatus", () => GameStatus.PRE_GAME);

    const event: GameEvent = {
      event: GameEventType.PLAYER_JOIN_GAME,
      user: "some-username",
    };

    playerJoinGame(state, event, Sinon.stub());

    Sinon.assert.calledOnceWithExactly(
      mock_addNewPlayer,
      state,
      "some-username"
    );
  });

  it("everyone should receive player join event", function () {
    const state = new GameState();

    const messageAllFn = Sinon.fake();
    const event: GameEvent = {
      event: GameEventType.PLAYER_JOIN_GAME,
      user: "birdsarentreal",
    };

    playerJoinGame(state, event, messageAllFn);

    Sinon.assert.calledOnceWithExactly(messageAllFn, {
      event: GameEventType.PLAYER_JOIN_GAME,
      user: "birdsarentreal",
    });
  });

  it("shouldnt be able to join a game that is started", function () {
    const state = new GameState();
    state.start();

    const messageAllFn = Sinon.stub();
    const event: GameEvent = {
      event: GameEventType.PLAYER_JOIN_GAME,
      user: "birdsarentreal",
    };

    assert.throws(function () {
      playerJoinGame(state, event, messageAllFn);
    }, "game has already started");
    Sinon.assert.notCalled(mock_addNewPlayer);
  });

  it("should allow players to rejoin if disconnected", function () {
    const state = new GameState();
    Sinon.replace(state, "getStatus", () => GameStatus.AWAITING_ACTION);
    state.start();
    state.pause();
    const testPlayer = new Player("tommy tester", [Card.DUKE, Card.DUKE]);
    testPlayer.isConnected = false;
    state.addPlayer(testPlayer);

    assert.isTrue(state.isPaused);
    assert.strictEqual(state.players.length, 1);

    const playerJoinEvent: GameEvent = {
      event: GameEventType.PLAYER_JOIN_GAME,
      user: "tommy tester",
    };

    playerJoinGame(state, playerJoinEvent, Sinon.stub());

    assert.isFalse(state.isPaused);
    assert.strictEqual(state.players.length, 1);
    assert.isTrue(state.players[0].isConnected);
  });

  it("rejoined players should still have their cards", function () {
    const state = new GameState();
    state.start();
    state.pause();
    const testPlayer = new Player("tommy tester", [Card.DUKE, Card.CONTESSA]);
    testPlayer.revealCard(Card.DUKE);
    testPlayer.isConnected = false;
    state.addPlayer(testPlayer);

    assert.isTrue(state.isPaused);
    assert.strictEqual(state.players.length, 1);

    const playerJoinEvent: GameEvent = {
      event: GameEventType.PLAYER_JOIN_GAME,
      user: "tommy tester",
    };

    playerJoinGame(state, playerJoinEvent, Sinon.stub());

    assert.isTrue(state.players[0].hasCard(Card.CONTESSA));
    assert.isTrue(
      state.players[0].cards.find((x) => x.card === Card.DUKE)!.isRevealed
    );
  });

  it("should not restart the game if only one of two disconnected players rejoin", function () {
    const state = new GameState();
    state.start();
    state.pause();

    const testPlayer1 = new Player("lois", [Card.DUKE, Card.DUKE]);
    testPlayer1.isConnected = false;
    state.addPlayer(testPlayer1);

    const testPlayer2 = new Player("peter", [Card.CONTESSA, Card.CONTESSA]);
    testPlayer2.isConnected = false;
    state.addPlayer(testPlayer2);

    assert.isTrue(state.isPaused);
    assert.strictEqual(state.players.length, 2);

    const playerJoinEvent: GameEvent = {
      event: GameEventType.PLAYER_JOIN_GAME,
      user: "lois",
    };

    playerJoinGame(state, playerJoinEvent, Sinon.stub());

    assert.isTrue(state.isPaused);
    assert.strictEqual(state.players.length, 2);
    assert.isTrue(state.players.find((x) => x.name === "lois")!.isConnected);
    assert.isFalse(state.players.find((x) => x.name === "peter")!.isConnected);
  });

  it("should restart the game when all disconnected players rejoin", function () {
    const state = new GameState();
    state.start();
    state.pause();

    const testPlayer1 = new Player("lois", [Card.DUKE, Card.DUKE]);
    testPlayer1.isConnected = false;
    state.addPlayer(testPlayer1);

    const testPlayer2 = new Player("peter", [Card.CONTESSA, Card.CONTESSA]);
    testPlayer2.isConnected = false;
    state.addPlayer(testPlayer2);

    assert.isTrue(state.isPaused);
    assert.strictEqual(state.players.length, 2);

    const playerJoinEvent: GameEvent = {
      event: GameEventType.PLAYER_JOIN_GAME,
      user: "lois",
    };

    playerJoinGame(state, playerJoinEvent, Sinon.stub());

    assert.isTrue(state.isPaused);
    assert.isTrue(state.players.find((x) => x.name === "lois")!.isConnected);
    assert.isFalse(state.players.find((x) => x.name === "peter")!.isConnected);

    playerJoinGame(state, { ...playerJoinEvent, user: "peter" }, Sinon.stub());

    assert.isFalse(state.isPaused);
    assert.strictEqual(state.players.length, 2);
    assert.isTrue(state.players.find((x) => x.name === "lois")?.isConnected);
    assert.isTrue(state.players.find((x) => x.name === "peter")?.isConnected);
  });

  it("should not trigger resume game if player reconnects and game is over", function () {
    const mock_resumeGame = Sinon.stub(
      module_resumeGame,
      "resumeGame"
    ).returns();
    const state = new GameState();
    Sinon.replace(state, "getStatus", () => GameStatus.GAME_OVER);
    const player = new Player("tester", [Card.AMBASSADOR, Card.AMBASSADOR]);
    player.isConnected = false;
    state.addPlayer(player);

    const event: GameEvent = {
      event: GameEventType.PLAYER_JOIN_GAME,
      user: "tester",
    };

    playerJoinGame(state, event, Sinon.stub());

    Sinon.assert.notCalled(mock_resumeGame);
    mock_resumeGame.restore();
  });
});
