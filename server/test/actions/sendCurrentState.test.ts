import { assert } from "chai";
import Sinon from "sinon";
import { ClientPlayer } from "../../../shared/ClientGameState";
import { sendCurrentState } from "../../src/actions/sendCurrentState";
import { generateStateWithNPlayers } from "../testHelpers/stateGenerators";

describe("action sendCurrentState", function () {
  it("should map correct currentPlayer", function () {
    const state = generateStateWithNPlayers(2);
    const mockMessageAllFn = Sinon.stub();

    sendCurrentState(state, mockMessageAllFn);

    Sinon.assert.calledOnce(mockMessageAllFn);
    const event = mockMessageAllFn.getCall(0).args[0];
    assert.equal(event.data.state.currentPlayerName, "tester-0");
  });

  it("should map correct game status", function () {
    const state = generateStateWithNPlayers(2);
    assert.equal(state.gameStatus, "RUNNING");
    const mockMessageAllFn = Sinon.stub();

    sendCurrentState(state, mockMessageAllFn);

    Sinon.assert.calledOnce(mockMessageAllFn);
    const event = mockMessageAllFn.getCall(0).args[0];
    assert.equal(event.data.state.gameStatus, "RUNNING");
  });

  it("should map deck count correctly", function () {
    const state = generateStateWithNPlayers(2);
    assert.equal(state.deck.count, 15);
    state.deck.drawCard(1);
    assert.equal(state.deck.count, 14);
    const mockMessageAllFn = Sinon.stub();

    sendCurrentState(state, mockMessageAllFn);

    Sinon.assert.calledOnce(mockMessageAllFn);
    const event = mockMessageAllFn.getCall(0).args[0];
    assert.equal(event.data.state.deckCount, 14);
  });

  it("should map players correctly", function () {
    const state = generateStateWithNPlayers(2);
    const mockMessageAllFn = Sinon.stub();

    sendCurrentState(state, mockMessageAllFn);

    Sinon.assert.calledOnce(mockMessageAllFn);
    const event = mockMessageAllFn.getCall(0).args[0];
    const players = event.data.state.players as ClientPlayer[];
    assert.lengthOf(players, 2);
    const player0 = players.find((x) => x.name === "tester-0");
    const player1 = players.find((x) => x.name === "tester-1");
    assert.equal(player0?.coins, 2);
    assert.equal(player1?.coins, 2);

    // TODO: test with one player no revealed cards, one with 1 card revealed, and one with both revealed (and verify they are out)
  });
});
