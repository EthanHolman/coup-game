import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CardPicker from "./CardPicker";
import Sinon from "sinon";
import { Card } from "../../../shared/Card";
import { assert, expect } from "chai";
import { isAriaSelected } from "../../test/helpers";

const getConfirmButton = () =>
  screen.getByRole("button", { name: "[Confirm]" });

const getCardButton = (card: Card) =>
  screen.getByRole("button", { name: card.toString() });

describe("CardPicker component", function () {
  it("should render all cards as clickable buttons", function () {
    render(
      <CardPicker
        cards={[Card.AMBASSADOR, Card.ASSASSIN]}
        onPickCards={Sinon.stub()}
        selectCount={1}
      />
    );
    assert.isDefined(getCardButton(Card.AMBASSADOR));
    assert.isDefined(getCardButton(Card.ASSASSIN));
  });

  it("should trigger callback with (1) selected card when confirm is clicked", async function () {
    const mockCallback = Sinon.stub();
    render(
      <CardPicker
        cards={[Card.AMBASSADOR, Card.ASSASSIN]}
        onPickCards={mockCallback}
        selectCount={1}
      />
    );
    await userEvent.click(getCardButton(Card.ASSASSIN));
    await userEvent.click(getConfirmButton());
    Sinon.assert.calledOnceWithExactly(mockCallback, [Card.ASSASSIN]);
  });

  it("should trigger callback with (2) selected cards when confirm is clicked", async function () {
    const mockCallback = Sinon.stub();
    render(
      <CardPicker
        cards={[Card.AMBASSADOR, Card.ASSASSIN]}
        onPickCards={mockCallback}
        selectCount={2}
      />
    );
    await userEvent.click(getCardButton(Card.ASSASSIN));
    await userEvent.click(getCardButton(Card.AMBASSADOR));
    await userEvent.click(getConfirmButton());
    Sinon.assert.calledOnceWithExactly(mockCallback, [
      Card.ASSASSIN,
      Card.AMBASSADOR,
    ]);
  });

  it("should not allow confirming until selectCount is reached", async function () {
    const mockCallback = Sinon.stub();
    render(
      <CardPicker
        cards={[Card.AMBASSADOR, Card.ASSASSIN, Card.CAPTAIN]}
        onPickCards={mockCallback}
        selectCount={2}
      />
    );
    const confirmBtn = getConfirmButton();
    expect(confirmBtn).to.have.attr("disabled");
    await userEvent.click(confirmBtn);
    Sinon.assert.notCalled(mockCallback);
    await userEvent.click(getCardButton(Card.AMBASSADOR));
    expect(confirmBtn).to.have.attr("disabled");
    await userEvent.click(getCardButton(Card.ASSASSIN));
    expect(confirmBtn).not.to.have.attr("disabled");
    await userEvent.click(confirmBtn);
    Sinon.assert.calledOnceWithExactly(mockCallback, [
      Card.AMBASSADOR,
      Card.ASSASSIN,
    ]);
  });

  it("clicking an option twice should select, then deselect it", async function () {
    render(
      <CardPicker
        cards={[Card.AMBASSADOR, Card.ASSASSIN, Card.CAPTAIN]}
        onPickCards={Sinon.stub()}
        selectCount={1}
      />
    );
    const ambassadorButton = getCardButton(Card.AMBASSADOR);
    const assassinButton = getCardButton(Card.ASSASSIN);
    assert.isFalse(isAriaSelected(ambassadorButton));
    await userEvent.click(ambassadorButton);
    assert.isTrue(isAriaSelected(ambassadorButton));
    assert.isFalse(isAriaSelected(assassinButton));
    await userEvent.click(ambassadorButton);
    assert.isFalse(isAriaSelected(ambassadorButton));
  });

  it("should disable only unselected options when selectCount count is reached", async function () {
    render(
      <CardPicker
        cards={[Card.AMBASSADOR, Card.ASSASSIN, Card.CAPTAIN]}
        onPickCards={Sinon.stub()}
        selectCount={1}
      />
    );
    const ambassadorButton = getCardButton(Card.AMBASSADOR);
    const assassinButton = getCardButton(Card.ASSASSIN);
    const captainButton = getCardButton(Card.CAPTAIN);
    expect(assassinButton).not.to.have.attr("disabled");
    expect(captainButton).not.to.have.attr("disabled");

    await userEvent.click(ambassadorButton);

    assert.isTrue(isAriaSelected(ambassadorButton));
    assert.isFalse(isAriaSelected(assassinButton));
    expect(ambassadorButton).not.to.have.attr("disabled");
    expect(assassinButton).to.have.attr("disabled");
    expect(captainButton).to.have.attr("disabled");

    await userEvent.click(ambassadorButton);

    assert.isFalse(isAriaSelected(ambassadorButton));
    expect(assassinButton).not.to.have.attr("disabled");
    expect(captainButton).not.to.have.attr("disabled");
  });
});
