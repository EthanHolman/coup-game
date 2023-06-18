import { render, screen } from "@testing-library/react";
import LoseCardView from "./LoseCardView";
import { Card } from "../../../../shared/Card";
import Sinon from "sinon";
import userEvent from "@testing-library/user-event";
import { GameEvent } from "../../../../shared/GameEvent";
import { GameEventType } from "../../../../shared/enums";
import { assert } from "chai";

describe("LoseCardView component", function () {
  it("should render", function () {
    render(
      <LoseCardView
        playerCards={[Card.AMBASSADOR, Card.ASSASSIN]}
        username="bob"
        reason="sad day you lose a card"
        sendEvent={Sinon.stub()}
      />
    );

    screen.getByText(/choose a card to lose/gi);
    screen.getByText(/sad day you lose a card/gi);
  });

  it("should sendEvent when user chooses a card", async function () {
    const mockSendEvent = Sinon.stub();
    render(
      <LoseCardView
        playerCards={[Card.AMBASSADOR, Card.ASSASSIN]}
        username="bob"
        reason="sad day you lose a card"
        sendEvent={mockSendEvent}
      />
    );

    await userEvent.click(
      screen.getByRole("button", { name: Card.AMBASSADOR.toString() })
    );

    const expectedEvent: GameEvent = {
      event: GameEventType.PLAYER_REVEAL_CARD,
      user: "bob",
      data: { card: Card.AMBASSADOR },
    };

    Sinon.assert.calledOnce(mockSendEvent);
    const call = JSON.stringify(mockSendEvent.getCall(0).args[0]);
    assert.equal(call, JSON.stringify(expectedEvent));
  });
});
