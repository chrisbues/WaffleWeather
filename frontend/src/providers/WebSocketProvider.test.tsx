import { describe, expect, it, vi, beforeEach } from "vitest";
import { screen, act } from "@testing-library/react";
import { render } from "@testing-library/react";
import WebSocketProvider, { useWebSocket } from "./WebSocketProvider";

// Track created WebSocket instances
let mockWsInstances: Array<{
  url: string;
  onopen: ((e?: unknown) => void) | null;
  onclose: ((e?: unknown) => void) | null;
  onmessage: ((e: { data: string }) => void) | null;
  onerror: ((e?: unknown) => void) | null;
  close: ReturnType<typeof vi.fn>;
}>;

beforeEach(() => {
  mockWsInstances = [];
  vi.stubGlobal(
    "WebSocket",
    Object.assign(
      class MockWebSocket {
        url: string;
        readyState = 0;
        onopen: ((e?: unknown) => void) | null = null;
        onclose: ((e?: unknown) => void) | null = null;
        onmessage: ((e: { data: string }) => void) | null = null;
        onerror: ((e?: unknown) => void) | null = null;
        close = vi.fn();
        send = vi.fn();
        constructor(url: string) {
          this.url = url;
          mockWsInstances.push(this);
        }
      },
      { OPEN: 1, CLOSED: 3 },
    ),
  );
});

function TestConsumer() {
  const { latestObservation, diagnostics, connected } = useWebSocket();
  return (
    <div>
      <span data-testid="connected">{String(connected)}</span>
      <span data-testid="temp">
        {latestObservation?.temp_outdoor ?? "none"}
      </span>
      <span data-testid="diagnostics">
        {diagnostics ? "present" : "none"}
      </span>
    </div>
  );
}

describe("WebSocketProvider", () => {
  it("creates a WebSocket connection on mount", () => {
    render(
      <WebSocketProvider>
        <TestConsumer />
      </WebSocketProvider>,
    );
    expect(mockWsInstances.length).toBeGreaterThanOrEqual(1);
  });

  it("sets connected=true on open", async () => {
    render(
      <WebSocketProvider>
        <TestConsumer />
      </WebSocketProvider>,
    );
    expect(screen.getByTestId("connected").textContent).toBe("false");

    await act(async () => {
      mockWsInstances[0].onopen?.();
    });
    expect(screen.getByTestId("connected").textContent).toBe("true");
  });

  it("parses observation messages", async () => {
    render(
      <WebSocketProvider>
        <TestConsumer />
      </WebSocketProvider>,
    );
    await act(async () => {
      mockWsInstances[0].onopen?.();
      mockWsInstances[0].onmessage?.({
        data: JSON.stringify({ temp_outdoor: 25.5 }),
      });
    });
    expect(screen.getByTestId("temp").textContent).toBe("25.5");
  });

  it("extracts diagnostics from messages", async () => {
    render(
      <WebSocketProvider>
        <TestConsumer />
      </WebSocketProvider>,
    );
    await act(async () => {
      mockWsInstances[0].onopen?.();
      mockWsInstances[0].onmessage?.({
        data: JSON.stringify({
          temp_outdoor: 25.5,
          diagnostics: { batteries: {}, gateway: {} },
        }),
      });
    });
    expect(screen.getByTestId("diagnostics").textContent).toBe("present");
  });

  it("sets connected=false on close", async () => {
    render(
      <WebSocketProvider>
        <TestConsumer />
      </WebSocketProvider>,
    );
    await act(async () => {
      mockWsInstances[0].onopen?.();
    });
    expect(screen.getByTestId("connected").textContent).toBe("true");

    await act(async () => {
      mockWsInstances[0].onclose?.();
    });
    expect(screen.getByTestId("connected").textContent).toBe("false");
  });

  it("ignores malformed messages", async () => {
    render(
      <WebSocketProvider>
        <TestConsumer />
      </WebSocketProvider>,
    );
    await act(async () => {
      mockWsInstances[0].onopen?.();
      mockWsInstances[0].onmessage?.({ data: "not json" });
    });
    expect(screen.getByTestId("temp").textContent).toBe("none");
  });
});
