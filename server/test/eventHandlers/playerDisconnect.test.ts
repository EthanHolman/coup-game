import { assert } from "chai";
import Sinon from "sinon";
import { Card, Deck } from "../../src/Deck";
import { GameEventType } from "../../src/enums";
import { playerDisconnect } from "../../src/eventHandlers/playerDisconnect";
import { GameState } from "../../src/GameState";
import { Player } from "../../src/Player";
import { GameEvent } from "../../src/types";

describe("playerDisconnect event handler", function () {
  it("should update the player as no longer connected, and pause game, if game is started", function () {
    const state = new GameState();
    state.start();
    const player = new Player("elon musk", [Card.AMBASSADOR, Card.DUKE]);
    state.addPlayer(player);

    const event: GameEvent = {
      event: GameEventType.PLAYER_DISCONNECT,
      user: "elon musk",
    };

    playerDisconnect(state, event, Sinon.stub());

    assert.isFalse(state.players[0].isConnected);
    assert.equal(state.gameStatus, "PAUSED");
  });

  it("should remove player from state if player disconnects during pre-game", function () {
    const state = new GameState();
    assert.equal(state.gameStatus, "PRE_GAME");
    const player = new Player("elon musk", [Card.AMBASSADOR, Card.DUKE]);
    state.addPlayer(player);

    const event: GameEvent = {
      event: GameEventType.PLAYER_DISCONNECT,
      user: "elon musk",
    };

    playerDisconnect(state, event, Sinon.stub());

    assert.equal(
      state.players.findIndex((x) => x.name === "elon musk"),
      -1
    );
  });

  it("should discard player cards if this happens pre-game", function () {
    const state = new GameState();
    state.deck = new Deck([Card.AMBASSADOR, Card.ASSASSIN, Card.CONTESSA]);
    assert.equal(state.gameStatus, "PRE_GAME");

    const player = new Player("elon musk", state.deck.drawCard(2));
    state.addPlayer(player);

    const event: GameEvent = {
      event: GameEventType.PLAYER_DISCONNECT,
      user: "elon musk",
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
    assert.equal(state.gameStatus, "PRE_GAME");

    const player = new Player("elon musk", state.deck.drawCard(2));
    state.addPlayer(player);

    const event: GameEvent = {
      event: GameEventType.PLAYER_DISCONNECT,
      user: "elon musk",
    };

    const messageAllFn = Sinon.fake();

    playerDisconnect(state, event, messageAllFn);

    Sinon.assert.calledOnceWithExactly(messageAllFn, { ...event });
  });

  // it("should make someone else host if the host is who disconnected", function () {});
});
