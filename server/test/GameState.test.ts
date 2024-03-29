import { assert } from "chai";
import { GameState } from "../src/GameState";
import { GameActionMove, GameEventType, GameStatus } from "../../shared/enums";
import { Player } from "../src/Player";
import { Card } from "../../shared/Card";
import { generateStateWithNPlayers } from "./testHelpers/stateGenerators";
import * as module_generateGameCode from "../src/utils/generateGameCode";
import Sinon from "sinon";

describe("GameState", function () {
  it("should generate and set gameCode ", function () {
    const mock = Sinon.stub(
      module_generateGameCode,
      "generateGameCode"
    ).returns("my-special-id");

    const gameState = new GameState();
    assert.strictEqual(gameState.gameCode, "my-special-id");

    mock.restore();
  });

  describe("getStatus", function () {
    it("PRE_GAME", function () {
      const state = new GameState();
      assert.strictEqual(state.getStatus(), GameStatus.PRE_GAME);
    });

    it("GAME_OVER", function () {
      const state = new GameState();
      state.addPlayer(new Player("tester-0", [Card.AMBASSADOR, Card.ASSASSIN]));
      const player = new Player("tester-1", [Card.AMBASSADOR, Card.ASSASSIN]);
      player.revealCard(Card.AMBASSADOR);
      player.revealCard(Card.ASSASSIN);
      state.addPlayer(player);
      state.start();
      assert.strictEqual(state.getStatus(), GameStatus.GAME_OVER);
    });

    it("PLAYER_LOSING_CARD", function () {
      const state = generateStateWithNPlayers(2);
      state.playerLosingCard = { player: "someone", reason: "they suck" };
      assert.strictEqual(state.getStatus(), GameStatus.PLAYER_LOSING_CARD);
    });

    it("AWAITING_ACTION", function () {
      const state = generateStateWithNPlayers(2);
      assert.strictEqual(state.getStatus(), GameStatus.AWAITING_ACTION);
    });

    it("ACTION_SELECTED", function () {
      const state = generateStateWithNPlayers(2);
      state.currentAction = { action: GameActionMove.INCOME };
      assert.strictEqual(state.getStatus(), GameStatus.ACTION_SELECTED);
    });

    it("ACTION_BLOCKED", function () {
      const state = generateStateWithNPlayers(2);
      state.currentAction = {
        action: GameActionMove.STEAL,
        targetPlayer: "tester-1",
      };
      state.blockAction = {
        event: GameEventType.BLOCK_ACTION,
        user: "tester-1",
        data: { card: Card.CAPTAIN },
      };
      assert.strictEqual(state.getStatus(), GameStatus.ACTION_BLOCKED);
    });

    it("AWAITING_EXCHANGE", function () {
      const state = generateStateWithNPlayers(2);
      state.exchangeCards = [Card.AMBASSADOR, Card.CAPTAIN];
      assert.strictEqual(state.getStatus(), GameStatus.AWAITING_EXCHANGE);
    });
  });
});
