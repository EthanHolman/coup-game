import { render, screen } from "@testing-library/react";
import Help from "./Help";
import { assert } from "chai";
import userEvent from "@testing-library/user-event";
import Sinon from "sinon";

describe("Help component", function () {
  it("should not render when show=false", function () {
    render(<Help show={false} onClose={() => {}} />);

    const result = screen.queryByText(/how to play coup/gi);
    assert.isNull(result);
  });

  it("should trigger onClose when close clicked", async function () {
    const stub = Sinon.stub();
    render(<Help show={true} onClose={stub} />);

    screen.getByText(/how to play coup/gi);
    await userEvent.click(screen.getByText(/close/gi));
    Sinon.assert.calledOnce(stub);
  });
});
