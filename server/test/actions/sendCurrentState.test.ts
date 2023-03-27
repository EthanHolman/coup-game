import { assert } from "chai";
import Sinon from "sinon";
import { generateStateWithNPlayers } from "../testHelpers/stateGenerators";
import * as module_buildClientState from "../../src/utils/buildClientState";
import { sendCurrentState } from "../../src/actions/sendCurrentState";

describe("action sendCurrentState", function () {
  let mock_buildClientState: Sinon.SinonStub;

  this.beforeEach(function () {
    mock_buildClientState = Sinon.stub(
      module_buildClientState,
      "buildClientState"
    ).returns({} as any);
  });

  this.afterEach(function () {
    mock_buildClientState.restore();
  });

  it("should send state to all connected players", function () {
    const state = generateStateWithNPlayers(3);
    const mockMessagePlayerFn = Sinon.stub();

    sendCurrentState(state, mockMessagePlayerFn);

    assert.lengthOf(mockMessagePlayerFn.getCalls(), 3);
    Sinon.assert.calledWith(mockMessagePlayerFn.getCall(0), "tester-0");
    Sinon.assert.calledWith(mockMessagePlayerFn.getCall(1), "tester-1");
    Sinon.assert.calledWith(mockMessagePlayerFn.getCall(2), "tester-2");
  });

  it("should not send state to disconnected players", function () {
    const state = generateStateWithNPlayers(3);
    const player1 = state.players.find((x) => x.name === "tester-1")!;
    player1.isConnected = false;
    const mockMessagePlayerFn = Sinon.stub();

    sendCurrentState(state, mockMessagePlayerFn);

    assert.lengthOf(mockMessagePlayerFn.getCalls(), 2);
    Sinon.assert.calledWith(mockMessagePlayerFn.getCall(0), "tester-0");
    Sinon.assert.calledWith(mockMessagePlayerFn.getCall(1), "tester-2");
  });
});
