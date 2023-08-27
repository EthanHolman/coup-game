import { render, screen } from "@testing-library/react";
import Sinon from "sinon";
import ActionPickerView from "./ActionPickerView";
import { GameActionMove, GameEventType } from "../../../../shared/enums";
import { assert } from "chai";
import userEvent from "@testing-library/user-event";
import { GameEvent } from "../../../../shared/GameEvent";
import { Card } from "../../../../shared/Card";
import { ClientGameAction } from "../../getAvailableActions";
import * as module_actionbuttons from "./ActionButtons";
import * as module_targetplayerbuttons from "./PlayerTargetButtons";
import * as module_cardbuttons from "./CardButtons";
import { ActionButtonsProps } from "./ActionButtons";
import { PlayerTargetButtonsProps } from "./PlayerTargetButtons";

describe("ActionPickerView component", function () {
  let mock_actionbuttons: Sinon.SinonStub;
  let mock_playerbtns: Sinon.SinonStub;
  let mock_cardbuttons: Sinon.SinonStub;

  this.beforeEach(function () {
    mock_actionbuttons = Sinon.stub(module_actionbuttons, "default").callsFake(
      (props: ActionButtonsProps) => (
        <button
          onClick={() => props.onPickAction(props.availableActions[0].action)}
        >
          ActionBtn
        </button>
      )
    );
    mock_playerbtns = Sinon.stub(
      module_targetplayerbuttons,
      "default"
    ).callsFake((props: PlayerTargetButtonsProps) => (
      <button onClick={() => props.onPickPlayer("test-user")}>PlayerBtn</button>
    ));
    mock_cardbuttons = Sinon.stub(module_cardbuttons, "default").callsFake(
      (props: module_cardbuttons.CardButtonsProps) => (
        <button onClick={() => props.onPickCard(Card.AMBASSADOR)}>card</button>
      )
    );
  });

  this.afterEach(function () {
    mock_actionbuttons.restore();
    mock_playerbtns.restore();
    mock_cardbuttons.restore();
  });

  it("should render action buttons by default", function () {
    render(
      <ActionPickerView
        availableActions={[new ClientGameAction(GameEventType.CONFIRM_ACTION)]}
        targetPlayers={[]}
        username="test1"
        sendEvent={Sinon.stub()}
      />
    );

    screen.getByText("ActionBtn");
  });

  it("should render player target buttons if targeted action selected", async function () {
    render(
      <ActionPickerView
        availableActions={[new ClientGameAction(GameActionMove.ASSASSINATE)]}
        targetPlayers={[]}
        username="test1"
        sendEvent={Sinon.stub()}
      />
    );

    await userEvent.click(screen.getByText("ActionBtn"));

    screen.getByText("PlayerBtn");
  });

  it("should trigger sendEvent callback when user selects a non-targeted GameActionMove", async function () {
    const mockSendEvent = Sinon.stub();
    render(
      <ActionPickerView
        availableActions={[new ClientGameAction(GameActionMove.INCOME)]}
        targetPlayers={[]}
        username="test1"
        sendEvent={mockSendEvent}
      />
    );
    await userEvent.click(screen.getByText("ActionBtn"));

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
        availableActions={[new ClientGameAction(GameEventType.CONFIRM_ACTION)]}
        targetPlayers={[]}
        username="test1"
        sendEvent={mockSendEvent}
      />
    );
    await userEvent.click(screen.getByText("ActionBtn"));

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
        availableActions={[new ClientGameAction(GameActionMove.ASSASSINATE)]}
        targetPlayers={[]}
        username="test1"
        sendEvent={mockSendEvent}
      />
    );
    await userEvent.click(screen.getByText("ActionBtn"));
    await userEvent.click(screen.getByText("PlayerBtn"));

    const expectedEvent: GameEvent = {
      event: GameEventType.CHOOSE_ACTION,
      user: "test1",
      data: { action: GameActionMove.ASSASSINATE, targetPlayer: "test-user" },
    };
    const call = JSON.stringify(mockSendEvent.getCall(0).args[0]);
    assert.strictEqual(call, JSON.stringify(expectedEvent));
  });

  it("should trigger sendEvent callback after user selects block action and selects a card to block with", async function () {
    const mockSendEvent = Sinon.stub();
    render(
      <ActionPickerView
        availableActions={[new ClientGameAction(GameEventType.BLOCK_ACTION)]}
        targetPlayers={[]}
        username="test1"
        sendEvent={mockSendEvent}
      />
    );
    await userEvent.click(screen.getByText("ActionBtn"));
    await userEvent.click(screen.getByText("card"));

    const expectedEvent: GameEvent = {
      event: GameEventType.BLOCK_ACTION,
      user: "test1",
      data: { card: Card.AMBASSADOR },
    };
    const call = JSON.stringify(mockSendEvent.getCall(0).args[0]);
    assert.strictEqual(call, JSON.stringify(expectedEvent));
  });
});
