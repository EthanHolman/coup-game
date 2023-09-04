import { render, screen } from "@testing-library/react";
import { UIMessageType } from "../UIMessage";
import MessageViewer from "./MessageViewer";

window.HTMLElement.prototype.scrollIntoView = function () {};

describe("MessageViewer component", function () {
  it("should render all types of messages", async function () {
    const mockState = {
      thisPlayer: { name: "edawg" },
    } as any;
    const msgs = [
      { user: "skip", message: "this is a msg", type: UIMessageType.User },
      {
        user: "__server",
        message: "sirskull41 lost the game",
        type: UIMessageType.Server,
      },
      {
        user: "ui?",
        message: "something bad happened",
        type: UIMessageType.Error,
      },
    ] as any;

    render(<MessageViewer events={msgs} state={mockState} />);

    screen.getByText(/this is a msg/i);
    screen.getByText(/sirskull41 lost the game/i);
    screen.getByText(/something bad happened/i);
  });
});
