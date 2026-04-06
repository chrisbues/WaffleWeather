import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/wrappers";
import Sidebar from "./Sidebar";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

// Mock WebSocketProvider
vi.mock("@/providers/WebSocketProvider", () => ({
  useWebSocket: () => ({ connected: true }),
}));

describe("Sidebar", () => {
  it("renders WaffleWeather branding", () => {
    renderWithProviders(<Sidebar open={true} onClose={() => {}} />);
    expect(screen.getByText("WaffleWeather")).toBeInTheDocument();
  });

  it("renders all navigation links", () => {
    renderWithProviders(<Sidebar open={true} onClose={() => {}} />);
    expect(screen.getByText("Observatory")).toBeInTheDocument();
    expect(screen.getByText("Lightning")).toBeInTheDocument();
    expect(screen.getByText("Wind Rose")).toBeInTheDocument();
    expect(screen.getByText("History")).toBeInTheDocument();
    expect(screen.getByText("Diagnostics")).toBeInTheDocument();
  });

  it("shows 'Live' when connected", () => {
    renderWithProviders(<Sidebar open={true} onClose={() => {}} />);
    expect(screen.getByText("Live")).toBeInTheDocument();
  });

  it("shows unit toggle buttons", () => {
    renderWithProviders(<Sidebar open={true} onClose={() => {}} />);
    expect(screen.getByText("Metric")).toBeInTheDocument();
    expect(screen.getByText("Imperial")).toBeInTheDocument();
  });

  it("calls onClose when close button clicked", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(<Sidebar open={true} onClose={onClose} />);
    await user.click(screen.getByLabelText("Close menu"));
    expect(onClose).toHaveBeenCalled();
  });

  it("highlights active nav item", () => {
    renderWithProviders(<Sidebar open={true} onClose={() => {}} />);
    const observatoryLink = screen.getByText("Observatory").closest("a");
    expect(observatoryLink?.className).toContain("text-primary");
  });
});
