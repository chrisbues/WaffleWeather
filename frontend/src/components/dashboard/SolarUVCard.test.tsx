import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/wrappers";
import { makeObservation } from "@/test/fixtures";
import SolarUVCard from "./SolarUVCard";

describe("SolarUVCard", () => {
  it("renders solar radiation", () => {
    renderWithProviders(
      <SolarUVCard data={makeObservation()} solarTrend={null} uvTrend={null} />,
    );
    expect(screen.getByText("450")).toBeInTheDocument();
  });

  it("renders UV index with level", () => {
    renderWithProviders(
      <SolarUVCard data={makeObservation({ uv_index: 5.2 })} solarTrend={null} uvTrend={null} />,
    );
    expect(screen.getByText("5.2")).toBeInTheDocument();
    expect(screen.getByText("Moderate")).toBeInTheDocument();
  });

  it("shows 'Low' for UV < 3", () => {
    renderWithProviders(
      <SolarUVCard data={makeObservation({ uv_index: 1.5 })} solarTrend={null} uvTrend={null} />,
    );
    expect(screen.getByText("Low")).toBeInTheDocument();
  });

  it("shows 'Extreme' for UV >= 11", () => {
    renderWithProviders(
      <SolarUVCard data={makeObservation({ uv_index: 12.0 })} solarTrend={null} uvTrend={null} />,
    );
    expect(screen.getByText("Extreme")).toBeInTheDocument();
  });

  it("handles null data", () => {
    renderWithProviders(
      <SolarUVCard data={null} solarTrend={null} uvTrend={null} />,
    );
    expect(screen.getByText("Solar & UV")).toBeInTheDocument();
  });
});
