import Sinon from "sinon";
import { Card } from "../../../shared/Card";
import { Player } from "../../src/Player";
import { generateStateWithNPlayers } from "../testHelpers/stateGenerators";
import { playerRevealCard } from "../../src/eventHandlers/playerRevealCard";
import { GameEvent } from "../../../shared/GameEvent";
import {
  GameActionMove,
  GameEventType,
  GameStatus,
} from "../../../shared/enums";
import { assert } from "chai";
import { SERVER_USERNAME } from "../../../shared/globals";
import { GameState } from "../../src/GameState";

describe("playerRevealCard event handler", function () {
  it("should throw error when GameStatus is not PLAYER_LOSING_CARD", function () {
    const state = generateStateWithNPlayers(2);
    Sinon.replace(state, "getStatus", () => GameStatus.ACTION_SELECTED);
    const event: GameEvent = {
      event: GameEventType.PLAYER_REVEAL_CARD,
      user: "unlucky",
      data: { card: Card.AMBASSADOR },
    };

    assert.throws(function () {
      playerRevealCard(state, event, Sinon.stub());
    }, "only valid when status = PLAYER_LOSING_CARD");
  });

  it("should throw error when the wrong people send event to lose a card", function () {
    const state = generateStateWithNPlayers(2);
    Sinon.replace(state, "getStatus", () => GameStatus.PLAYER_LOSING_CARD);
    state.playerLosingCard = { player: "tester-1", reason: "" };
    const event: GameEvent = {
      event: GameEventType.PLAYER_REVEAL_CARD,
      user: "tester-0",
      data: { card: Card.AMBASSADOR },
    };

    assert.throws(function () {
      playerRevealCard(state, event, Sinon.stub());
    }, "wrong user");
  });

  it("should throw error if card is missing from event data", function () {
    const state = generateStateWithNPlayers(2);
    Sinon.replace(state, "getStatus", () => GameStatus.PLAYER_LOSING_CARD);
    state.playerLosingCard = { player: "tester-1", reason: "" };
    const event: GameEvent = {
      event: GameEventType.PLAYER_REVEAL_CARD,
      user: "tester-1",
    };

    assert.throws(function () {
      playerRevealCard(state, event, Sinon.stub());
    }, "missing card to lose");
  });

  it("should update appropriate player: call player.revealCard", function () {
    const state = generateStateWithNPlayers(2);
    Sinon.replace(state, "getStatus", () => GameStatus.PLAYER_LOSING_CARD);
    state.playerLosingCard = { player: "unlucky", reason: "" };
    const playerLosingCard = new Player("unlucky", [
      Card.CAPTAIN,
      Card.AMBASSADOR,
    ]);
    const stub_revealCard = Sinon.stub(
      playerLosingCard,
      "revealCard"
    ).returns();
    state.addPlayer(playerLosingCard);

    const event: GameEvent = {
      event: GameEventType.PLAYER_REVEAL_CARD,
      user: "unlucky",
      data: { card: Card.AMBASSADOR },
    };

    playerRevealCard(state, event, Sinon.stub());

    Sinon.assert.calledOnceWithExactly(stub_revealCard, Card.AMBASSADOR);
  });

  it("should clear playerLosingCard from gameState", function () {
    const state = generateStateWithNPlayers(2);
    Sinon.replace(state, "getStatus", () => GameStatus.PLAYER_LOSING_CARD);
    state.playerLosingCard = { player: "tester-1", reason: "" };
    const event: GameEvent = {
      event: GameEventType.PLAYER_REVEAL_CARD,
      user: "tester-1",
      data: { card: Card.CONTESSA },
    };

    playerRevealCard(state, event, Sinon.stub());

    assert.isUndefined(state.playerLosingCard);
  });

  it("should forward event to all users", function () {
    const state = generateStateWithNPlayers(2);
    Sinon.replace(state, "getStatus", () => GameStatus.PLAYER_LOSING_CARD);
    state.playerLosingCard = { player: "tester-1", reason: "" };
    const event: GameEvent = {
      event: GameEventType.PLAYER_REVEAL_CARD,
      user: "tester-1",
      data: { card: Card.CONTESSA },
    };
    const mockMessageAllPlayerFn = Sinon.stub();

    playerRevealCard(state, event, mockMessageAllPlayerFn);

    Sinon.assert.calledOnceWithMatch(mockMessageAllPlayerFn, event);
  });

  it("should alert all players if the player is now out of the game", function () {
    const state = generateStateWithNPlayers(2);
    const unluckyPlayer = new Player("unlucky", [
      Card.AMBASSADOR,
      Card.ASSASSIN,
    ]);
    unluckyPlayer.revealCard(Card.ASSASSIN);
    state.addPlayer(unluckyPlayer);
    Sinon.replace(state, "getStatus", () => GameStatus.PLAYER_LOSING_CARD);
    state.playerLosingCard = { player: unluckyPlayer.name, reason: "" };
    const event: GameEvent = {
      event: GameEventType.PLAYER_REVEAL_CARD,
      user: unluckyPlayer.name,
      data: { card: Card.AMBASSADOR },
    };
    const mockMessageAllPlayerFn = Sinon.stub();

    playerRevealCard(state, event, mockMessageAllPlayerFn);

    assert.isTrue(unluckyPlayer.isOut);
    const calls = mockMessageAllPlayerFn.getCalls();
    assert.lengthOf(calls, 2);
    assert.deepStrictEqual(calls[0].args[0], event);
    assert.deepStrictEqual(calls[1].args[0], {
      event: GameEventType.PLAYER_OUT,
      user: SERVER_USERNAME,
      data: { name: "unlucky" },
    });
  });

  it("should clear current action if it's a coup/assassinate targeting the player who is now out", function () {
    const state = generateStateWithNPlayers(2);
    const unluckyPlayer = new Player("unlucky", [
      Card.AMBASSADOR,
      Card.ASSASSIN,
    ]);
    unluckyPlayer.revealCard(Card.ASSASSIN);
    state.addPlayer(unluckyPlayer);
    Sinon.replace(state, "getStatus", () => GameStatus.PLAYER_LOSING_CARD);
    state.playerLosingCard = { player: unluckyPlayer.name, reason: "" };
    state.currentAction = {
      action: GameActionMove.ASSASSINATE,
      targetPlayer: "unlucky",
    };
    const event: GameEvent = {
      event: GameEventType.PLAYER_REVEAL_CARD,
      user: unluckyPlayer.name,
      data: { card: Card.AMBASSADOR },
    };
    const mockMessageAllPlayerFn = Sinon.stub();
    assert.isDefined(state.currentAction);

    playerRevealCard(state, event, mockMessageAllPlayerFn);

    assert.isUndefined(state.currentAction);
  });

  it("should send game_over message to all players if player losing card triggered end of game", function () {
    const state = new GameState();
    const player0 = new Player("player0", [Card.AMBASSADOR, Card.ASSASSIN]);
    player0.revealCard(Card.ASSASSIN);
    state.addPlayer(player0);
    const player1 = new Player("player1", [Card.CAPTAIN, Card.CONTESSA]);
    player1.revealCard(Card.CAPTAIN);
    state.addPlayer(player1);
    const player2 = new Player("player2", [Card.CAPTAIN, Card.CONTESSA]);
    player2.revealCard(Card.CAPTAIN);
    player2.revealCard(Card.CONTESSA);
    state.addPlayer(player2);
    state.start();

    state.playerLosingCard = { player: "player0", reason: "he sux" };
    const mockMessageAllPlayerFn = Sinon.stub();

    const event: GameEvent = {
      event: GameEventType.PLAYER_REVEAL_CARD,
      user: "player0",
      data: { card: Card.AMBASSADOR },
    };

    playerRevealCard(state, event, mockMessageAllPlayerFn);

    assert.strictEqual(state.getStatus(), GameStatus.GAME_OVER);
    const calls = mockMessageAllPlayerFn.getCalls();
    assert.lengthOf(calls, 3);
    assert.deepStrictEqual(calls[2].args[0], {
      event: GameEventType.GAME_OVER,
      user: SERVER_USERNAME,
      data: { name: "player1" },
    });
  });
});
