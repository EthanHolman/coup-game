import { assert } from "chai";
import { nextTurn } from "../../src/actions/nextTurn";
import { generateStateWithNPlayers } from "../testHelpers/stateGenerators";
import {
  GameActionMove,
  GameEventType,
  GameStatus,
} from "../../../shared/enums";
import { Card } from "../../../shared/Card";
import { Player } from "../../src/Player";
import Sinon from "sinon";
import { SERVER_USERNAME } from "../../../shared/globals";
import { GameState } from "../../src/GameState";

describe("nextTurn action handler", function () {
  it("should update currentPlayerId from 0 to 1", function () {
    const state = generateStateWithNPlayers(2);
    assert.strictEqual(state.currentPlayerId, 0);
    nextTurn(state, Sinon.stub());
    assert.strictEqual(state.currentPlayerId, 1);
  });

  it("should update currentPlayerId from 2 to 0", function () {
    const state = generateStateWithNPlayers(3);
    state.currentPlayerId = 2;
    assert.strictEqual(state.currentPlayerId, 2);
    nextTurn(state, Sinon.stub());
    assert.strictEqual(state.currentPlayerId, 0);
  });

  it("should update currentPlayerId from 1 to 0 when playerId 2 is out", function () {
    const state = generateStateWithNPlayers(2);
    const player = new Player("THE tester", [Card.AMBASSADOR, Card.ASSASSIN]);
    player.revealCard(Card.AMBASSADOR);
    player.revealCard(Card.ASSASSIN);
    state.addPlayer(player);
    state.currentPlayerId = 1;
    assert.strictEqual(state.currentPlayerId, 1);
    nextTurn(state, Sinon.stub());
    assert.strictEqual(state.currentPlayerId, 0);
  });

  it("should clear playerLosingCard", function () {
    const state = generateStateWithNPlayers(2);
    state.playerLosingCard = { player: "username", reason: "just cuz" };
    nextTurn(state, Sinon.stub());
    assert.isUndefined(state.playerLosingCard);
  });

  it("should clear currentAction", function () {
    const state = generateStateWithNPlayers(2);
    state.currentAction = {
      action: GameActionMove.ASSASSINATE,
      targetPlayer: "somepoordude",
    };
    nextTurn(state, Sinon.stub());
    assert.isUndefined(state.currentAction);
  });

  it("should clear blockAction", function () {
    const state = generateStateWithNPlayers(2);
    state.currentAction = { action: GameActionMove.EXCHANGE };
    state.blockAction = {
      event: GameEventType.BLOCK_ACTION,
      user: "tester-0",
      data: { card: Card.AMBASSADOR },
    };
    nextTurn(state, Sinon.stub());
    assert.isUndefined(state.blockAction);
  });

  it("should send event to all players that its a new player's turn", function () {
    const state = generateStateWithNPlayers(2);
    assert.strictEqual(state.currentPlayer.name, "tester-0");
    const mockMessageAllFn = Sinon.stub();
    nextTurn(state, mockMessageAllFn);
    Sinon.assert.calledOnce(mockMessageAllFn);
    assert.deepEqual(mockMessageAllFn.getCall(0).args[0], {
      event: GameEventType.NEXT_TURN,
      user: SERVER_USERNAME,
      data: { name: "tester-1" },
    });
  });

  it("should send game_over message to all players if player losing card triggered end of game", function () {
    const state = new GameState();
    const player0 = new Player("player0", [Card.AMBASSADOR, Card.ASSASSIN]);
    player0.revealCard(Card.ASSASSIN);
    player0.revealCard(Card.AMBASSADOR);
    state.addPlayer(player0);
    const player1 = new Player("player1", [Card.CAPTAIN, Card.CONTESSA]);
    player1.revealCard(Card.CAPTAIN);
    state.addPlayer(player1);
    state.start();
    const mockMessageAllPlayerFn = Sinon.stub();

    nextTurn(state, mockMessageAllPlayerFn);

    assert.strictEqual(state.getStatus(), GameStatus.GAME_OVER);
    Sinon.assert.calledOnce(mockMessageAllPlayerFn);
    const calls = mockMessageAllPlayerFn.getCalls();
    assert.deepStrictEqual(calls[0].args[0], {
      event: GameEventType.GAME_OVER,
      user: SERVER_USERNAME,
      data: { name: "player1" },
    });
  });
});
