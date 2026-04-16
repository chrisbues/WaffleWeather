import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { render } from "@testing-library/react";
import { useQueryClient } from "@tanstack/react-query";
import QueryProvider from "./QueryProvider";

function TestConsumer() {
  const client = useQueryClient();
  const defaults = client.getDefaultOptions();
  return (
    <div>
      <span data-testid="staleTime">{String(defaults.queries?.staleTime)}</span>
      <span data-testid="retry">{String(defaults.queries?.retry)}</span>
      <span data-testid="refetchInterval">
        {String(defaults.queries?.refetchInterval)}
      </span>
    </div>
  );
}

describe("QueryProvider", () => {
  it("provides a QueryClient to children", () => {
    render(
      <QueryProvider>
        <TestConsumer />
      </QueryProvider>,
    );
    expect(screen.getByTestId("staleTime").textContent).toBe("30000");
  });

  it("sets retry to 2", () => {
    render(
      <QueryProvider>
        <TestConsumer />
      </QueryProvider>,
    );
    expect(screen.getByTestId("retry").textContent).toBe("2");
  });

  it("does not set a global refetchInterval (each hook owns its cadence)", () => {
    render(
      <QueryProvider>
        <TestConsumer />
      </QueryProvider>,
    );
    expect(screen.getByTestId("refetchInterval").textContent).toBe("undefined");
  });
});
