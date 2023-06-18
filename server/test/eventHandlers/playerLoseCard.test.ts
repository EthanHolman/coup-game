import Sinon from "sinon";
import { Card } from "../../../shared/Card";
import { Player } from "../../src/Player";
import { generateStateWithNPlayers } from "../testHelpers/stateGenerators";
import { playerRevealCard } from "../../src/eventHandlers/playerRevealCard";
import { GameEvent } from "../../../shared/GameEvent";
import { GameEventType, GameStatus } from "../../../shared/enums";
import { assert } from "chai";

describe("playerRevealCard event handler", function () {
  it("should throw error when GameStatus is not PLAYER_LOSING_CARD", function () {
    const state = generateStateWithNPlayers(2);
    Sinon.replaceGetter(state, "status", () => GameStatus.ACTION_SELECTED);
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
    Sinon.replaceGetter(state, "status", () => GameStatus.PLAYER_LOSING_CARD);
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
    Sinon.replaceGetter(state, "status", () => GameStatus.PLAYER_LOSING_CARD);
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
    Sinon.replaceGetter(state, "status", () => GameStatus.PLAYER_LOSING_CARD);
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
    Sinon.replaceGetter(state, "status", () => GameStatus.PLAYER_LOSING_CARD);
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
    Sinon.replaceGetter(state, "status", () => GameStatus.PLAYER_LOSING_CARD);
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
});
