import { assert } from "chai";
import { GameState } from "../../src/GameState";
import { addNewPlayer } from "../../src/actions/addNewPlayer";
import { Player } from "../../src/Player";
import { Card } from "../../../shared/Card";

describe("addNewPlayer action", function () {
  it("should add player to game state", function () {
    const state = new GameState();
    assert.strictEqual(state.players.length, 0);

    addNewPlayer(state, "birdsarentreal");

    assert.strictEqual(state.players.length, 1);
  });

  it("players cards should be removed from top of deck", function () {
    const state = new GameState();
    const originalDeck = [...state.deck._deck];

    addNewPlayer(state, "birdsarentreal");

    assert.deepEqual(state.deck._deck, originalDeck.slice(2));
    assert.isTrue(state.players[0].hasCard(originalDeck[0]));
    assert.isTrue(state.players[0].hasCard(originalDeck[1]));
  });

  it("shouldnt be able to use an existing username", function () {
    const state = new GameState();
    state.addPlayer(
      new Player("birdsarentreal", [Card.AMBASSADOR, Card.AMBASSADOR])
    );
    assert.equal(state.players[0].name, "birdsarentreal");

    assert.throws(function () {
      addNewPlayer(state, "birdsarentreal");
    }, "birdsarentreal has already been");
  });

  it("should make new player the host if they are first to join", function () {
    const state = new GameState();

    addNewPlayer(state, "ethan");

    assert.strictEqual(state.players.length, 1);
    assert.isTrue(state.players.find((x) => x.name === "ethan")?.isHost);
  });
});
