import { assert } from "chai";
import Sinon from "sinon";
import { GameEventType, GameStatus } from "../../../shared/enums";
import { Deck } from "../../src/Deck";
import { Card } from "../../../shared/Card";
import { playerDisconnect } from "../../src/eventHandlers/playerDisconnect";
import { GameEvent } from "../../../shared/GameEvent";
import { GameState } from "../../src/GameState";
import { Player } from "../../src/Player";
import { generateStateWithNPlayers } from "../testHelpers/stateGenerators";

describe("playerDisconnect event handler", function () {
  it("should update the player as no longer connected, and pause game, if game is started", function () {
    const state = new GameState();
    state.start();
    const player = new Player("some dude", [Card.AMBASSADOR, Card.DUKE]);
    state.addPlayer(player);

    const event: GameEvent = {
      event: GameEventType.PLAYER_DISCONNECT,
      user: "some dude",
    };

    playerDisconnect(state, event, Sinon.stub());

    assert.isFalse(state.players[0].isConnected);
    assert.isTrue(state.isPaused);
  });

  it("should remove player from state if player disconnects during pre-game", function () {
    const state = new GameState();
    assert.equal(state.getStatus(), GameStatus.PRE_GAME);
    const player = new Player("some dude", [Card.AMBASSADOR, Card.DUKE]);
    state.addPlayer(player);

    const event: GameEvent = {
      event: GameEventType.PLAYER_DISCONNECT,
      user: "some dude",
    };

    playerDisconnect(state, event, Sinon.stub());

    assert.equal(
      state.players.findIndex((x) => x.name === "some dude"),
      -1
    );
  });

  it("should discard player cards if this happens pre-game", function () {
    const state = new GameState();
    state.deck = new Deck([Card.AMBASSADOR, Card.ASSASSIN, Card.CONTESSA]);
    assert.equal(state.getStatus(), GameStatus.PRE_GAME);

    const player = new Player("some dude", state.deck.drawCard(2));
    state.addPlayer(player);

    const event: GameEvent = {
      event: GameEventType.PLAYER_DISCONNECT,
      user: "some dude",
    };

    assert.equal(state.deck._deck.length, 1);
    assert.equal(state.deck.peekCard(), Card.CONTESSA);

    playerDisconnect(state, event, Sinon.stub());

    assert.deepStrictEqual(state.deck._deck, [
      Card.CONTESSA,
      Card.AMBASSADOR,
      Card.ASSASSIN,
    ]);
  });

  it("should alert all other players in pre-game of player disconnecting", function () {
    const state = new GameState();
    assert.equal(state.getStatus(), GameStatus.PRE_GAME);

    const player = new Player("some dude", state.deck.drawCard(2));
    state.addPlayer(player);

    const event: GameEvent = {
      event: GameEventType.PLAYER_DISCONNECT,
      user: "some dude",
    };

    const messageAllFn = Sinon.fake();

    playerDisconnect(state, event, messageAllFn);

    Sinon.assert.calledOnceWithExactly(messageAllFn, { ...event });
  });

  it("should make someone else host if host disconnects", function () {
    const state = generateStateWithNPlayers(2);
    assert.isTrue(state.players[0].isHost);
    assert.isFalse(state.isPaused);

    playerDisconnect(
      state,
      { event: GameEventType.PLAYER_DISCONNECT, user: "tester-0" },
      Sinon.stub()
    );

    assert.isFalse(state.players[0].isConnected);
    assert.isFalse(state.players[0].isHost);
    assert.isTrue(state.players[1].isHost);
  });

  it("should make someone else host if host disconnects, and host is not player 0", function () {
    const state = generateStateWithNPlayers(3);
    state.players[0].isHost = false;
    state.players[1].isHost = true;
    state.currentPlayerId = 2;

    playerDisconnect(
      state,
      { event: GameEventType.PLAYER_DISCONNECT, user: "tester-1" },
      Sinon.stub()
    );

    assert.isFalse(state.players[1].isConnected);
    assert.isFalse(state.players[1].isHost);
    assert.isTrue(state.players[0].isHost);
  });
});
