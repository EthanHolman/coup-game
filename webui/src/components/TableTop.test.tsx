import { render, screen } from "@testing-library/react";
import TableTop from "./TableTop";
import { expect } from "chai";

describe("TableTop component", function () {
  it("should render children", function () {
    render(
      <TableTop>
        <div>This is test child text</div>
      </TableTop>
    );

    expect(screen.getByText("This is test child text")).to.exist;
  });
});
