import { render, screen } from "@testing-library/react";
import CardButtons from "./CardButtons";
import Sinon from "sinon";
import { assert } from "chai";
import { ALL_CARDS, Card } from "../../../../shared/Card";
import userEvent from "@testing-library/user-event";

describe("CardButtons component", function () {
  it("should display all cards as buttons", function () {
    render(<CardButtons onPickCard={Sinon.stub()} />);
    const buttons = screen.getAllByRole("button");
    assert.strictEqual(buttons.length, ALL_CARDS.length);
    buttons.forEach((button) => {
      assert.isTrue(ALL_CARDS.includes(button.textContent as any));
    });
  });

  it("should trigger callback with card value on button click", async function () {
    const mockOnPickCard = Sinon.stub();
    render(<CardButtons onPickCard={mockOnPickCard} />);
    await userEvent.click(screen.getByRole("button", { name: /ambassador/i }));
    Sinon.assert.calledOnceWithExactly(mockOnPickCard, Card.AMBASSADOR);
  });
});
