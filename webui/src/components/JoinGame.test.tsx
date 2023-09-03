import Sinon from "sinon";
import * as module_globals from "../../../shared/globals";
import { render, screen } from "@testing-library/react";
import JoinGame from "./JoinGame";
import userEvent from "@testing-library/user-event";

describe("JoinGame component", function () {
  it("should allow submitting valid usernames", async function () {
    const stub = Sinon.stub(module_globals.USERNAME_REGEX, "test").returns(
      true
    );
    const onJoinCallback = Sinon.stub();

    render(<JoinGame onJoin={onJoinCallback} existingUsername="" />);

    await userEvent.click(screen.getByPlaceholderText(/your name/i));
    await userEvent.keyboard("valid-username");
    await userEvent.click(
      screen.getByRole("button", { name: /join the game/i })
    );
    Sinon.assert.calledOnceWithExactly(onJoinCallback, "valid-username");
    stub.restore();
  });

  it("should not allow typing invalid characters", async function () {
    const stub = Sinon.stub(
      module_globals,
      "USERNAME_NOT_ALLOWED_CHARS_REGEX"
    ).value(/[0-9]/);
    const onJoinCallback = Sinon.stub();

    render(<JoinGame onJoin={onJoinCallback} existingUsername="" />);

    await userEvent.click(screen.getByPlaceholderText(/your name/i));
    await userEvent.keyboard("numbers-1234-filtered-out");

    const expected = "numbers--filtered-out";
    screen.getByDisplayValue(expected);
    await userEvent.click(
      screen.getByRole("button", { name: /join the game/i })
    );
    Sinon.assert.calledOnceWithExactly(onJoinCallback, expected);

    stub.restore();
  });

  it("should pre-populate input field with existing username, if available", async function () {
    const onJoinCallback = Sinon.stub();
    render(
      <JoinGame onJoin={onJoinCallback} existingUsername="Chuck Norris" />
    );

    screen.getByDisplayValue("Chuck Norris");
    await userEvent.click(
      screen.getByRole("button", { name: /join the game/i })
    );
    Sinon.assert.calledOnceWithExactly(onJoinCallback, "Chuck Norris");
  });
});
