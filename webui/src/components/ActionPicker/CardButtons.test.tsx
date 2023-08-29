import { render, screen } from "@testing-library/react";
import CardButtons from "./CardButtons";
import Sinon from "sinon";
import { assert } from "chai";
import { Card } from "../../../../shared/Card";
import userEvent from "@testing-library/user-event";

describe("CardButtons component", function () {
  it("should display all cards as buttons", function () {
    const cards = [Card.AMBASSADOR, Card.ASSASSIN, Card.CONTESSA];
    render(<CardButtons cards={cards} onPickCard={Sinon.stub()} />);
    const buttons = screen.getAllByRole("button");
    assert.strictEqual(buttons.length, cards.length);
    buttons.forEach((button) => {
      assert.isTrue(cards.includes(button.textContent as any));
    });
  });

  it("should trigger callback with card value on button click", async function () {
    const mockOnPickCard = Sinon.stub();
    const cards = [Card.CAPTAIN, Card.AMBASSADOR, Card.ASSASSIN];
    render(<CardButtons cards={cards} onPickCard={mockOnPickCard} />);
    await userEvent.click(screen.getByRole("button", { name: /ambassador/i }));
    Sinon.assert.calledOnceWithExactly(mockOnPickCard, Card.AMBASSADOR);
  });
});
