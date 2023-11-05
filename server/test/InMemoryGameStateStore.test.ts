import { assert } from "chai";
import { InMemoryGameStateStore } from "../src/InMemoryGameStateStore";

describe("InMemoryGameStateStore", function () {
  it("should list all game codes", function () {
    const store = new InMemoryGameStateStore();
    const name1 = store.createNewGame();
    const name2 = store.createNewGame();

    const result = store.listGameCodes();
    assert.sameMembers(result, [name1, name2]);
  });

  it("should return state by gameCode", function () {
    throw "not implemented";
  });

  it("should allow updating an existing game code with new state", function () {
    throw "not implemented";
  });

  it("should return game code from newly created games", function () {
    throw "not implemented";
  });
});
