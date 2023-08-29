import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Sinon from "sinon";
import { GameActionMove, GameEventType } from "../../../../shared/enums";
import ActionButtons from "./ActionButtons";
import { ClientGameAction } from "../../getAvailableActions";
import { assert } from "chai";
import * as module_timeoutconfirmactionbtn from "./TimeoutConfirmActionButton";
import { Card } from "../../../../shared/Card";

describe("ActionButtons component", function () {
  let stub_timeoutconfirmactionbtn: Sinon.SinonStub;

  this.beforeEach(function () {
    stub_timeoutconfirmactionbtn = Sinon.stub(
      module_timeoutconfirmactionbtn,
      "default"
    ).returns(<div data-testid="timeout-btn"></div>);
  });

  this.afterEach(function () {
    stub_timeoutconfirmactionbtn.restore();
  });

  it("should render all actions", async function () {
    const actions = [
      new ClientGameAction(GameActionMove.ASSASSINATE),
      new ClientGameAction(GameEventType.CHALLENGE_ACTION),
      new ClientGameAction(GameEventType.BLOCK_ACTION, undefined, [
        Card.AMBASSADOR,
        Card.CAPTAIN,
      ]),
    ];
    render(
      <ActionButtons availableActions={actions} onPickAction={Sinon.stub()} />
    );
    screen.getByText(GameActionMove.ASSASSINATE.toString());
    screen.getByText(GameEventType.CHALLENGE_ACTION.toString());
    screen.getByText(GameEventType.BLOCK_ACTION.toString());
  });

  it("should render name of card after 'block action' if only 1 block card", function () {
    const actions = [
      new ClientGameAction(GameEventType.BLOCK_ACTION, undefined, [
        Card.CONTESSA,
      ]),
    ];
    render(
      <ActionButtons availableActions={actions} onPickAction={Sinon.stub()} />
    );
    screen.getByText(GameEventType.BLOCK_ACTION.toString() + " with Contessa");
  });

  it("should render nothing if no actions provided", async function () {
    const { container } = render(
      <ActionButtons availableActions={[]} onPickAction={Sinon.stub()} />
    );
    assert.lengthOf(container.innerHTML, 0);
  });

  it("should trigger callback when user clicks a button", async function () {
    const actions = [new ClientGameAction(GameActionMove.ASSASSINATE)];
    const mockPickAction = Sinon.stub();
    render(
      <ActionButtons availableActions={actions} onPickAction={mockPickAction} />
    );
    await userEvent.click(
      screen.getByText(GameActionMove.ASSASSINATE.toString())
    );
    Sinon.assert.calledOnce(mockPickAction);
    assert.strictEqual(
      JSON.stringify(mockPickAction.getCall(0).args[0]),
      JSON.stringify({
        action: GameActionMove.ASSASSINATE,
        timeout: false,
        blockAsCards: undefined,
      })
    );
  });

  it("should render regular confirm button when no timeout is set", function () {
    render(
      <ActionButtons
        availableActions={[
          { action: GameEventType.CONFIRM_ACTION, timeout: false },
        ]}
        onPickAction={Sinon.stub()}
      />
    );

    assert.isNull(screen.queryByTestId("timeout-btn"));
    Sinon.assert.notCalled(stub_timeoutconfirmactionbtn);
  });

  it("should render timeout button if timeout is present on action", function () {
    render(
      <ActionButtons
        availableActions={[
          { action: GameEventType.CONFIRM_ACTION, timeout: true },
        ]}
        onPickAction={Sinon.stub()}
      />
    );

    screen.getByTestId("timeout-btn");
    Sinon.assert.calledOnce(stub_timeoutconfirmactionbtn);
  });
});
