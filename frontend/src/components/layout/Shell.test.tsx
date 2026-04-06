import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/wrappers";
import Shell from "./Shell";

// Mock Sidebar to avoid its dependency chain
vi.mock("./Sidebar", () => ({
  default: ({ open, onClose }: { open: boolean; onClose: () => void }) => (
    <div data-testid="sidebar" data-open={open}>
      <button onClick={onClose}>Close Sidebar</button>
    </div>
  ),
}));

describe("Shell", () => {
  it("renders children", () => {
    renderWithProviders(
      <Shell>
        <div data-testid="content">Hello</div>
      </Shell>,
    );
    expect(screen.getByTestId("content")).toBeInTheDocument();
  });

  it("renders WaffleWeather title in mobile header", () => {
    renderWithProviders(
      <Shell>
        <div>Content</div>
      </Shell>,
    );
    expect(screen.getByText("WaffleWeather")).toBeInTheDocument();
  });

  it("renders footer", () => {
    renderWithProviders(
      <Shell>
        <div>Content</div>
      </Shell>,
    );
    expect(
      screen.getByText(/Written by Timothy Brown/),
    ).toBeInTheDocument();
  });

  it("opens sidebar on menu button click", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <Shell>
        <div>Content</div>
      </Shell>,
    );
    const menuBtn = screen.getByLabelText("Open menu");
    await user.click(menuBtn);
    expect(screen.getByTestId("sidebar").getAttribute("data-open")).toBe("true");
  });
});
