import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/wrappers";
import SunCard from "./SunCard";

// Mock SunCalc
vi.mock("suncalc", () => ({
  default: {
    getTimes: () => ({
      sunrise: new Date("2026-04-05T06:30:00"),
      sunset: new Date("2026-04-05T18:15:00"),
      solarNoon: new Date("2026-04-05T12:22:00"),
      goldenHour: new Date("2026-04-05T17:30:00"),
    }),
    getPosition: () => ({
      altitude: (45 * Math.PI) / 180, // 45 degrees
    }),
  },
}));

// Mock stations API — with location
vi.mock("@/generated/stations/stations", () => ({
  useListStations: () => ({
    data: {
      data: [
        { id: "test", name: "Test Station", latitude: -33.87, longitude: 151.21 },
      ],
    },
  }),
}));

describe("SunCard", () => {
  it("renders sun card title", () => {
    renderWithProviders(<SunCard />);
    expect(screen.getByText("Sun")).toBeInTheDocument();
  });

  it("renders day length", () => {
    renderWithProviders(<SunCard />);
    expect(screen.getByText("Day length")).toBeInTheDocument();
  });

  it("renders solar noon label", () => {
    renderWithProviders(<SunCard />);
    expect(screen.getByText(/Solar noon/)).toBeInTheDocument();
  });

  it("renders sun arc SVG", () => {
    const { container } = renderWithProviders(<SunCard />);
    const svg = container.querySelector('svg[aria-label="Sun arc showing current sun position"]');
    expect(svg).toBeInTheDocument();
  });

  it("renders altitude", () => {
    renderWithProviders(<SunCard />);
    expect(screen.getByText("Altitude")).toBeInTheDocument();
    expect(screen.getByText("45°")).toBeInTheDocument();
  });

  it("renders golden hour label", () => {
    renderWithProviders(<SunCard />);
    expect(screen.getByText(/Golden hour/)).toBeInTheDocument();
  });
});
