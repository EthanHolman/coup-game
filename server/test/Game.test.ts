import { assert } from "chai";
import { GameRunner } from "../src/Game";
import { messagePlayerFn, messageAllFn } from "../src/types";

describe("gamerunner", function () {
  it("should be creatable", function () {
    const mockMsgPlayer: messagePlayerFn = (playerName, data) => {};
    const mockMsgAll: messageAllFn = (data) => {};

    const runner = new GameRunner({
      messagePlayer: mockMsgPlayer,
      messageAll: mockMsgAll,
    });

    assert.isNotNull(runner);
  });

  it("should be able to add a new player", function () {});

  it("should not be able to re-use player names", function () {});

  it("should be able to start a game with at least 2 players", function () {});

  it("should not be able to start game with less than 2 players", function () {});

  it("should not be able to start game if its already started", function () {});

  it("should not allow actions if game paused", function () {});

  it("should allow game to be unpaused", function () {});
});
