import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Sinon from "sinon";
import { GameActionMove, GameEventType } from "../../../../shared/enums";
import ActionButtons from "./ActionButtons";

describe("ActionButtons component", function () {
  it("should render all actions", async function () {
    const actions = [
      GameActionMove.ASSASSINATE,
      GameEventType.CHALLENGE_ACTION,
    ];
    render(
      <ActionButtons availableActions={actions} onPickAction={Sinon.stub()} />
    );
    screen.getByText(GameActionMove.ASSASSINATE.toString());
    screen.getByText(GameEventType.CHALLENGE_ACTION.toString());
  });

  it("should trigger callback when user clicks a button", async function () {
    const actions = [GameActionMove.ASSASSINATE];
    const mockPickAction = Sinon.stub();
    render(
      <ActionButtons availableActions={actions} onPickAction={mockPickAction} />
    );
    await userEvent.click(
      screen.getByText(GameActionMove.ASSASSINATE.toString())
    );
    Sinon.assert.calledWithExactly(mockPickAction, GameActionMove.ASSASSINATE);
  });
});
