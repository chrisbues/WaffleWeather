import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import InfoTip from "./InfoTip";

describe("InfoTip", () => {
  it("is hidden by default", () => {
    render(<InfoTip text="Hello" />);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("shows on click", () => {
    render(<InfoTip text="Hello" />);
    fireEvent.click(screen.getByLabelText("More info"));
    expect(screen.getByRole("tooltip")).toHaveTextContent("Hello");
  });

  it("hides on second click", () => {
    render(<InfoTip text="Hello" />);
    const trigger = screen.getByLabelText("More info");
    fireEvent.click(trigger);
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    fireEvent.click(trigger);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("closes on outside click", () => {
    render(
      <div>
        <InfoTip text="Hello" />
        <button>Outside</button>
      </div>,
    );
    fireEvent.click(screen.getByLabelText("More info"));
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    fireEvent.mouseDown(screen.getByText("Outside"));
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });
});
