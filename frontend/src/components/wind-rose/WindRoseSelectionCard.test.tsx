import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/wrappers";
import WindRoseSelectionCard from "./WindRoseSelectionCard";

describe("WindRoseSelectionCard", () => {
  it("renders empty prompt when selection is null", () => {
    renderWithProviders(
      <WindRoseSelectionCard selection={null} totalObs={0} />,
    );
    expect(
      screen.getByText(/hover or tap a segment to see details/i),
    ).toBeInTheDocument();
  });
});
