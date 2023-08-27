import Sinon from "sinon";
import TimeoutConfirmActionButton from "./TimeoutConfirmActionButton";
import { render, screen } from "@testing-library/react";
import { assert, expect } from "chai";
import { CONFIRM_TIMER_SEC } from "../../../../shared/globals";
import userEvent from "@testing-library/user-event";
import * as module_globals from "../../../../shared/globals";

describe("TimeoutConfirmActionButton", function () {
  it("should start at max timer time when first rendered", function () {
    render(<TimeoutConfirmActionButton onClick={Sinon.stub()} />);
    const confirmBtn = screen.getByRole("button", { name: /confirm/i });
    assert.isTrue(
      confirmBtn.innerHTML.includes(`(${CONFIRM_TIMER_SEC.toString()})`)
    );
  });

  it("should not allow clicking when timer is above 0", function (done) {
    const mockOnClick = Sinon.stub();

    render(<TimeoutConfirmActionButton onClick={mockOnClick} />);
    const confirmBtn = screen.getByRole("button", { name: /confirm/i });

    setTimeout(async function () {
      expect(confirmBtn).attribute("disabled");
      assert.isTrue(
        confirmBtn.innerHTML.includes(CONFIRM_TIMER_SEC.toString())
      );
      await userEvent.click(confirmBtn);
      Sinon.assert.notCalled(mockOnClick);
      done();
    }, 150);
  });

  it("should trigger callback, when clicked, after timer is at 0", function (done) {
    const stub = Sinon.stub(module_globals, "CONFIRM_TIMER_SEC").value(1);
    this.timeout(4000);
    const mockOnClick = Sinon.stub();

    render(<TimeoutConfirmActionButton onClick={mockOnClick} />);
    const confirmBtn = screen.getByRole("button", { name: /confirm/i });

    setTimeout(async function () {
      try {
        await userEvent.click(confirmBtn);
        Sinon.assert.calledOnce(mockOnClick);
        done();
      } catch (e) {
        done(e);
      }
      stub.restore();
    }, CONFIRM_TIMER_SEC * 1000 + 150);
  });

  it("should display timer countdown", function (done) {
    const stub = Sinon.stub(module_globals, "CONFIRM_TIMER_SEC").value(2);
    this.timeout(3000);

    render(<TimeoutConfirmActionButton onClick={Sinon.stub()} />);
    const confirmBtn = screen.getByRole("button", { name: /confirm/i });

    const observedValues = new Set();
    const observeInterval = 250;
    const timerRegexPattern = /\(([0-9]+)\)/;
    let timerTotal = 0;

    const intervalId = setInterval(function () {
      try {
        const matches = timerRegexPattern.exec(confirmBtn.innerHTML);
        if (matches && matches.length === 2) observedValues.add(matches[1]);
        timerTotal += observeInterval;

        if (timerTotal >= 2000) {
          assert.strictEqual(observedValues.size, 2);
          assert.sameMembers(Array.from(observedValues), ["2", "1"]);
          clearInterval(intervalId);
          stub.restore();
          done();
        }
      } catch (e) {
        done(e);
      }
    }, observeInterval);
  });
});
