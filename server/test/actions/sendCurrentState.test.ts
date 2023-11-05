import { assert } from "chai";
import Sinon from "sinon";
import { generateStateWithNPlayers } from "../testHelpers/stateGenerators";
import * as module_buildClientState from "../../src/utils/buildClientState";
import * as module_createServerEvent from "../../src/utils/createServerEvent";
import { sendCurrentState } from "../../src/actions/sendCurrentState";
import { GameEventType } from "../../../shared/enums";

describe("action sendCurrentState", function () {
  let mock_buildClientState: Sinon.SinonStub;
  let mock_createServerEvent: Sinon.SinonStub;

  this.beforeEach(function () {
    mock_buildClientState = Sinon.stub(
      module_buildClientState,
      "buildClientState"
    ).returns({ somefield: "val" } as any);
    mock_createServerEvent = Sinon.stub(
      module_createServerEvent,
      "createServerEvent"
    ).returns({ anotherField: "anotherval" } as any);
  });

  this.afterEach(function () {
    mock_buildClientState.restore();
    mock_createServerEvent.restore();
  });

  it("should send state to all connected players", function () {
    const state = generateStateWithNPlayers(3);
    const mockMessagePlayerFn = Sinon.stub();

    sendCurrentState(state, mockMessagePlayerFn);

    assert.lengthOf(mockMessagePlayerFn.getCalls(), 3);
    Sinon.assert.calledWith(
      mockMessagePlayerFn.getCall(0),
      Sinon.match.any,
      "tester-0",
      Sinon.match.any
    );
    Sinon.assert.calledWith(
      mockMessagePlayerFn.getCall(1),
      Sinon.match.any,
      "tester-1",
      Sinon.match.any
    );
    Sinon.assert.calledWith(
      mockMessagePlayerFn.getCall(2),
      Sinon.match.any,
      "tester-2",
      Sinon.match.any
    );
  });

  it("should not send state to disconnected players", function () {
    const state = generateStateWithNPlayers(3);
    const player1 = state.players.find((x) => x.name === "tester-1")!;
    player1.isConnected = false;
    const mockMessagePlayerFn = Sinon.stub();

    sendCurrentState(state, mockMessagePlayerFn);

    assert.lengthOf(mockMessagePlayerFn.getCalls(), 2);
    Sinon.assert.calledWith(
      mockMessagePlayerFn.getCall(0),
      Sinon.match.any,
      "tester-0",
      Sinon.match.any
    );
    Sinon.assert.calledWithExactly(
      mockMessagePlayerFn.getCall(1),
      Sinon.match.any,
      "tester-2",
      Sinon.match.any
    );
  });

  it("should be sending playerClientState in event body", function () {
    const state = generateStateWithNPlayers(1);
    const mockMessagePlayerFn = Sinon.stub();

    sendCurrentState(state, mockMessagePlayerFn);

    Sinon.assert.calledOnceWithExactly(
      mock_buildClientState,
      state,
      "tester-0"
    );
    Sinon.assert.calledOnceWithExactly(
      mock_createServerEvent,
      GameEventType.CURRENT_STATE,
      {
        state: { somefield: "val" },
      }
    );
    Sinon.assert.calledOnceWithExactly(
      mockMessagePlayerFn,
      Sinon.match.any,
      "tester-0",
      {
        anotherField: "anotherval",
      }
    );
  });
});
