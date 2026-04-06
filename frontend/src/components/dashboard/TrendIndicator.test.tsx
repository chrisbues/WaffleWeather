import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import TrendIndicator from "./TrendIndicator";

describe("TrendIndicator", () => {
  it("renders up arrow for 'up'", () => {
    render(<TrendIndicator trend="up" />);
    expect(screen.getByLabelText("Trending up")).toBeInTheDocument();
  });

  it("renders down arrow for 'down'", () => {
    render(<TrendIndicator trend="down" />);
    expect(screen.getByLabelText("Trending down")).toBeInTheDocument();
  });

  it("renders nothing for 'flat'", () => {
    const { container } = render(<TrendIndicator trend="flat" />);
    expect(container.innerHTML).toBe("");
  });

  it("renders nothing for null", () => {
    const { container } = render(<TrendIndicator trend={null} />);
    expect(container.innerHTML).toBe("");
  });
});
