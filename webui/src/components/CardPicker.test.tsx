import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CardPicker from "./CardPicker";
import Sinon from "sinon";
import { Card } from "../../../shared/Card";

describe("CardPicker component", function () {
  it("should render all cards as buttons", function () {
    render(
      <CardPicker
        cards={[Card.AMBASSADOR, Card.ASSASSIN]}
        onPickCard={Sinon.stub()}
      />
    );
    screen.getByRole("button", { name: Card.AMBASSADOR.toString() });
    screen.getByRole("button", { name: Card.ASSASSIN.toString() });
  });

  it("should trigger callback with card value when card is clicked", async function () {
    const mockCallback = Sinon.stub();
    render(
      <CardPicker
        cards={[Card.AMBASSADOR, Card.ASSASSIN]}
        onPickCard={mockCallback}
      />
    );
    await userEvent.click(
      screen.getByRole("button", { name: Card.ASSASSIN.toString() })
    );
    Sinon.assert.calledOnceWithExactly(mockCallback, Card.ASSASSIN);
  });
});
