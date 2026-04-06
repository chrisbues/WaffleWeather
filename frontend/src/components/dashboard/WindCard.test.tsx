import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/wrappers";
import { makeObservation } from "@/test/fixtures";
import WindCard from "./WindCard";

describe("WindCard", () => {
  it("renders wind speed", () => {
    renderWithProviders(<WindCard data={makeObservation()} trend={null} />);
    expect(screen.getByText("12.0")).toBeInTheDocument();
    expect(screen.getByText("km/h")).toBeInTheDocument();
  });

  it("renders compass direction", () => {
    renderWithProviders(<WindCard data={makeObservation({ wind_dir: 225 })} trend={null} />);
    expect(screen.getByText(/SW/)).toBeInTheDocument();
  });

  it("renders beaufort scale", () => {
    renderWithProviders(<WindCard data={makeObservation({ wind_speed: 12 })} trend={null} />);
    expect(screen.getByText(/Gentle breeze/)).toBeInTheDocument();
  });

  it("renders calm for very low speed", () => {
    renderWithProviders(<WindCard data={makeObservation({ wind_speed: 0.5 })} trend={null} />);
    expect(screen.getByText(/Calm/)).toBeInTheDocument();
  });

  it("renders violent storm for high speed", () => {
    renderWithProviders(<WindCard data={makeObservation({ wind_speed: 105 })} trend={null} />);
    expect(screen.getByText(/Violent storm/)).toBeInTheDocument();
  });

  it("renders SVG compass", () => {
    const { container } = renderWithProviders(
      <WindCard data={makeObservation()} trend={null} />,
    );
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("handles null data", () => {
    renderWithProviders(<WindCard data={null} trend={null} />);
    expect(screen.getByText("Wind")).toBeInTheDocument();
  });
});
