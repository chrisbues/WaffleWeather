import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/wrappers";
import { makeObservation } from "@/test/fixtures";
import RainCard from "./RainCard";

describe("RainCard", () => {
  it("renders rain rate", () => {
    renderWithProviders(<RainCard data={makeObservation({ rain_rate: 2.5 })} trend={null} />);
    expect(screen.getByText("2.5")).toBeInTheDocument();
    expect(screen.getByText("mm/h")).toBeInTheDocument();
  });

  it("renders daily total", () => {
    renderWithProviders(<RainCard data={makeObservation()} trend={null} />);
    expect(screen.getByText("Today")).toBeInTheDocument();
  });

  it("handles null data", () => {
    renderWithProviders(<RainCard data={null} trend={null} />);
    expect(screen.getByText("Rain")).toBeInTheDocument();
  });
});
