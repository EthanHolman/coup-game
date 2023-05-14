import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PlayerTargetButtons from "./PlayerTargetButtons";
import Sinon from "sinon";

describe("PlayerTargetButtons component", function () {
  it("should render all players as clickable buttons", async function () {
    const players = ["test1", "test2"];
    render(
      <PlayerTargetButtons players={players} onPickPlayer={Sinon.stub()} />
    );
    screen.getByText("test1");
    screen.getByText("test2");
  });

  it("should trigger callback when user btn is clicked", async function () {
    const players = ["test1", "test2"];
    const mockPickPlayer = Sinon.stub();
    render(
      <PlayerTargetButtons players={players} onPickPlayer={mockPickPlayer} />
    );
    await userEvent.click(screen.getByText("test1"));
    Sinon.assert.calledOnceWithExactly(mockPickPlayer, "test1");
  });
});
