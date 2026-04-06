import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/wrappers";
import { makeObservation } from "@/test/fixtures";
import PressureCard from "./PressureCard";

describe("PressureCard", () => {
  it("renders pressure in hPa", () => {
    renderWithProviders(<PressureCard data={makeObservation()} trend={null} />);
    expect(screen.getByText("1013.25")).toBeInTheDocument();
    expect(screen.getByText("hPa")).toBeInTheDocument();
  });

  it("renders zambretti forecast", () => {
    renderWithProviders(
      <PressureCard data={makeObservation({ zambretti_forecast: "Settled fine" })} trend={null} />,
    );
    expect(screen.getByText("Settled fine")).toBeInTheDocument();
  });

  it("omits forecast when not available", () => {
    renderWithProviders(
      <PressureCard data={makeObservation({ zambretti_forecast: null })} trend={null} />,
    );
    expect(screen.queryByText("Forecast")).not.toBeInTheDocument();
  });

  it("handles null data", () => {
    renderWithProviders(<PressureCard data={null} trend={null} />);
    expect(screen.getByText("Pressure")).toBeInTheDocument();
  });
});
