import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/wrappers";
import WeatherCard from "./WeatherCard";

describe("WeatherCard", () => {
  it("renders title and children", () => {
    renderWithProviders(
      <WeatherCard title="Temperature" icon={<span data-testid="icon" />}>
        <span>22.5</span>
      </WeatherCard>,
    );
    expect(screen.getByText("Temperature")).toBeInTheDocument();
    expect(screen.getByText("22.5")).toBeInTheDocument();
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("renders info tooltip when info prop provided", () => {
    renderWithProviders(
      <WeatherCard title="Test" icon={<span />} info="Some helpful info">
        <span>content</span>
      </WeatherCard>,
    );
    expect(screen.getByLabelText("More info")).toBeInTheDocument();
  });

  it("does not render info tooltip when no info prop", () => {
    renderWithProviders(
      <WeatherCard title="Test" icon={<span />}>
        <span>content</span>
      </WeatherCard>,
    );
    expect(screen.queryByLabelText("More info")).not.toBeInTheDocument();
  });
});
