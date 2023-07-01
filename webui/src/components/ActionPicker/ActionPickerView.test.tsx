import { render, screen } from "@testing-library/react";
import Sinon from "sinon";
import ActionPickerView from "./ActionPickerView";
import { GameActionMove, GameEventType } from "../../../../shared/enums";
import { assert } from "chai";
import userEvent from "@testing-library/user-event";
import { GameEvent } from "../../../../shared/GameEvent";
import { Card } from "../../../../shared/Card";

describe("ActionPickerView component", function () {
  it("should list available actions as buttons", async function () {
    render(
      <ActionPickerView
        availableActions={[
          GameActionMove.ASSASSINATE,
          GameEventType.BLOCK_ACTION,
        ]}
        targetPlayers={[]}
        username="test1"
        sendEvent={Sinon.stub()}
      />
    );
    screen.getByRole("button", {
      name: GameActionMove.ASSASSINATE.toString(),
    });
    screen.getByRole("button", {
      name: GameEventType.BLOCK_ACTION.toString(),
    });
  });

  it("should render nothing if no available actions", async function () {
    render(
      <ActionPickerView
        availableActions={[]}
        targetPlayers={[]}
        username="test1"
        sendEvent={Sinon.stub()}
      />
    );
    const picker = screen.getByRole("toolbar");
    assert.lengthOf(picker.innerHTML, 0);
  });

  it("should trigger sendEvent callback when user selects a non-targeted GameActionMove", async function () {
    const mockSendEvent = Sinon.stub();
    render(
      <ActionPickerView
        availableActions={[
          GameActionMove.ASSASSINATE,
          GameEventType.BLOCK_ACTION,
          GameActionMove.INCOME,
        ]}
        targetPlayers={[]}
        username="test1"
        sendEvent={mockSendEvent}
      />
    );
    await userEvent.click(
      screen.getByRole("button", { name: GameActionMove.INCOME.toString() })
    );

    const expectedEvent: GameEvent = {
      event: GameEventType.CHOOSE_ACTION,
      user: "test1",
      data: { action: GameActionMove.INCOME },
    };
    const call = JSON.stringify(mockSendEvent.getCall(0).args[0]);
    assert.strictEqual(call, JSON.stringify(expectedEvent));
  });

  it("should trigger sendEvent callback when user selects a GameEventType", async function () {
    const mockSendEvent = Sinon.stub();
    render(
      <ActionPickerView
        availableActions={[GameEventType.CONFIRM_ACTION]}
        targetPlayers={[]}
        username="test1"
        sendEvent={mockSendEvent}
      />
    );
    await userEvent.click(
      screen.getByRole("button", {
        name: GameEventType.CONFIRM_ACTION.toString(),
      })
    );

    const expectedEvent: GameEvent = {
      event: GameEventType.CONFIRM_ACTION,
      user: "test1",
      data: {},
    };
    const call = JSON.stringify(mockSendEvent.getCall(0).args[0]);
    assert.strictEqual(call, JSON.stringify(expectedEvent));
  });

  it("should trigger sendEvent callback after user selects a player for targeted action", async function () {
    const mockSendEvent = Sinon.stub();
    render(
      <ActionPickerView
        availableActions={[GameActionMove.ASSASSINATE]}
        targetPlayers={["test2"]}
        username="test1"
        sendEvent={mockSendEvent}
      />
    );
    await userEvent.click(
      screen.getByRole("button", {
        name: GameActionMove.ASSASSINATE.toString(),
      })
    );
    await userEvent.click(screen.getByRole("button", { name: "test2" }));

    const expectedEvent: GameEvent = {
      event: GameEventType.CHOOSE_ACTION,
      user: "test1",
      data: { action: GameActionMove.ASSASSINATE, targetPlayer: "test2" },
    };
    const call = JSON.stringify(mockSendEvent.getCall(0).args[0]);
    assert.strictEqual(call, JSON.stringify(expectedEvent));
  });

  it("should trigger sendEvent callback after user selects block action and selects a card to block with", async function () {
    const mockSendEvent = Sinon.stub();
    render(
      <ActionPickerView
        availableActions={[GameEventType.BLOCK_ACTION]}
        targetPlayers={[]}
        username="test1"
        sendEvent={mockSendEvent}
      />
    );
    await userEvent.click(
      screen.getByRole("button", {
        name: GameEventType.BLOCK_ACTION.toString(),
      })
    );
    await userEvent.click(
      screen.getByRole("button", { name: Card.CAPTAIN.toString() })
    );

    const expectedEvent: GameEvent = {
      event: GameEventType.BLOCK_ACTION,
      user: "test1",
      data: { card: Card.CAPTAIN },
    };
    const call = JSON.stringify(mockSendEvent.getCall(0).args[0]);
    assert.strictEqual(call, JSON.stringify(expectedEvent));
  });
});
