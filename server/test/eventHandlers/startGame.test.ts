import { assert } from "chai";
import { GameState } from "../../src/GameState";
import { startGame } from "../../src/eventHandlers/startGame";
import { generateStateWithNPlayers } from "../testHelpers/stateGenerators";

describe("startGame", function () {
  it("shouldn't be able to start without players", function () {
    const state = new GameState();

    assert.throws(function () {
      startGame(state);
    });
  });

  it("shouldn't be able to start with less than 2 players", function () {
    const state = generateStateWithNPlayers(1);

    assert.throws(function () {
      startGame(state);
    });
  });

  it("should be able to start with 2 players", function () {
    const state = generateStateWithNPlayers(2);

    startGame(state);

    assert.isTrue(state.gameStarted);
    assert.equal(state.currentPlayer.name, "tester-0");
  });

  it("should be able to start with more than 2 players", function () {
    const state = generateStateWithNPlayers(5);

    startGame(state);

    assert.isTrue(state.gameStarted);
    assert.equal(state.currentPlayer.name, "tester-0");
  });
});
