import Sinon from "sinon";
import * as module_help from "../../src/components/Help/Help";
import * as module_api from "../../src/api";
import { render, screen } from "@testing-library/react";
import JoinGame from "./JoinGame";
import userEvent from "@testing-library/user-event";
import { assert, expect } from "chai";

describe("JoinGame component", function () {
  it("join and host game buttons should be disabled when empty name input", async function () {
    const onJoinStub = Sinon.stub();
    render(<JoinGame onJoin={onJoinStub} existingUsername="" />);

    const input = screen.getByPlaceholderText(/your name/i);
    expect(input).to.have.value("");

    const joinBtn = screen.getByText<HTMLButtonElement>(/join game/i);
    const hostBtn = screen.getByText<HTMLButtonElement>(/host new game/i);

    assert.isTrue(joinBtn.disabled);
    assert.isTrue(hostBtn.disabled);

    await userEvent.click(joinBtn);
    await userEvent.click(hostBtn);

    // make sure btns are there still
    screen.getByText(/join game/i);
    screen.getByText(/host new game/i);

    Sinon.assert.notCalled(onJoinStub);
  });

  it("should not allow typing invalid characters", async function () {
    render(<JoinGame onJoin={Sinon.stub()} existingUsername="" />);

    await userEvent.click(screen.getByPlaceholderText(/your name/i));
    await userEvent.keyboard("stuff-1234*&!-filtered-out");

    const expected = "stuff-1234-filtered-out";
    screen.getByDisplayValue(expected);
  });

  it("should pre-populate input field with existing username, if available", async function () {
    render(<JoinGame onJoin={Sinon.stub()} existingUsername="Chuck Norris" />);

    screen.getByDisplayValue("Chuck Norris");
  });

  it("should allow joining existing games", async function () {
    const onJoinCallback = Sinon.stub();

    render(<JoinGame onJoin={onJoinCallback} existingUsername="" />);

    await userEvent.click(screen.getByPlaceholderText(/your name/i));
    await userEvent.keyboard("myname");

    await userEvent.click(screen.getByText(/join/i));

    await userEvent.click(screen.getByPlaceholderText(/game code/i));
    await userEvent.keyboard("mygamecode");

    await userEvent.click(screen.getByText(/join game/i));

    Sinon.assert.calledOnceWithExactly(onJoinCallback, "myname", "mygamecode");
  });

  it("should not allow joining existing game without game code", async function () {
    const onJoinCallback = Sinon.stub();

    render(<JoinGame onJoin={onJoinCallback} existingUsername="" />);

    await userEvent.click(screen.getByPlaceholderText(/your name/i));
    await userEvent.keyboard("myname");

    await userEvent.click(screen.getByText(/join/i));

    const gameCodeInput = screen.getByPlaceholderText(/game code/i);
    expect(gameCodeInput).to.have.value("");

    const joinGameBtn = screen.getByText<HTMLButtonElement>(/join game/i);
    assert.isTrue(joinGameBtn.disabled);

    await userEvent.click(joinGameBtn);
    Sinon.assert.notCalled(onJoinCallback);
  });

  it("should allow hosting a new game", async function () {
    const stub_api = Sinon.stub(module_api, "createNewGame").resolves({
      gameCode: "mySpecialCode",
    });
    const onJoinCallback = Sinon.stub();

    render(<JoinGame onJoin={onJoinCallback} existingUsername="" />);

    await userEvent.click(screen.getByPlaceholderText(/your name/i));
    await userEvent.keyboard("myname");

    await userEvent.click(screen.getByText(/host/i));

    screen.getByText("mySpecialCode");

    await userEvent.click(screen.getByText(/got it/i));

    Sinon.assert.calledOnceWithExactly(
      onJoinCallback,
      "myname",
      "mySpecialCode"
    );

    stub_api.restore();
  });

  it("should show the rules if player clicks 'see the rules'", async function () {
    const stub_help = Sinon.stub(module_help, "default").returns(
      <div>my_rules_str</div>
    );

    render(<JoinGame onJoin={Sinon.stub()} existingUsername="" />);

    await userEvent.click(screen.getByText(/see the rules/i));
    screen.getByText("my_rules_str");

    stub_help.restore();
  });
});
