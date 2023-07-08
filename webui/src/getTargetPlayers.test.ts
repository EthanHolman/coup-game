import { assert } from "chai";
import { getTargetPlayers } from "./getTargetPlayers";
import { generateClientState } from "../test/stateGenerators";

describe("getTargetPlayers", function () {
  it("should return empty list if no players", function () {
    const state = generateClientState(2, 0, 0);
    state.players = [];

    const result = getTargetPlayers(state);

    assert.isEmpty(result);
  });

  it("should return player names that are not out of game and not self-player", function () {
    const state = generateClientState(4, 0, 0);
    assert.strictEqual(state.username, "player-0");
    state.players[1].isOut = true;

    const result = getTargetPlayers(state);

    assert.sameDeepMembers(result, ["player-2", "player-3"]);
  });
});
