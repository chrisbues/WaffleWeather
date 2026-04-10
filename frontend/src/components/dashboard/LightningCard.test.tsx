import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/wrappers";
import { makeObservation } from "@/test/fixtures";
import LightningCard from "./LightningCard";

// Mock the generated hook
vi.mock("@/generated/lightning/lightning", () => ({
  useGetLightningSummary: () => ({ data: undefined }),
}));

describe("LightningCard", () => {
  it("renders em dash when summary not loaded", () => {
    renderWithProviders(
      <LightningCard data={makeObservation({ lightning_count: 5 })} />,
    );
    expect(screen.getByText("\u2014")).toBeInTheDocument();
    expect(screen.getByText("in 24h")).toBeInTheDocument();
  });

  it("renders lightning distance", () => {
    renderWithProviders(
      <LightningCard data={makeObservation({ lightning_distance: 14.0 })} />,
    );
    expect(screen.getByText(/14\.0/)).toBeInTheDocument();
  });

  it("shows em dash when summary not loaded and null count", () => {
    renderWithProviders(
      <LightningCard data={makeObservation({ lightning_count: null })} />,
    );
    expect(screen.getByText("\u2014")).toBeInTheDocument();
  });

  it("shows active pulse when lightning was recent", () => {
    const recentTime = new Date(Date.now() - 5 * 60 * 1000).toISOString(); // 5 min ago
    const { container } = renderWithProviders(
      <LightningCard data={makeObservation({ lightning_time: recentTime })} />,
    );
    expect(container.querySelector(".lightning-active")).toBeInTheDocument();
  });

  it("does not show active state for old lightning", () => {
    const oldTime = new Date(Date.now() - 60 * 60 * 1000).toISOString(); // 1 hour ago
    const { container } = renderWithProviders(
      <LightningCard data={makeObservation({ lightning_time: oldTime })} />,
    );
    expect(container.querySelector(".lightning-active")).not.toBeInTheDocument();
  });

  it("does not show active state for null lightning_time", () => {
    const { container } = renderWithProviders(
      <LightningCard data={makeObservation({ lightning_time: null })} />,
    );
    expect(container.querySelector(".lightning-active")).not.toBeInTheDocument();
  });

  it("handles null data", () => {
    renderWithProviders(<LightningCard data={null} />);
    expect(screen.getByText("Lightning")).toBeInTheDocument();
  });
});
