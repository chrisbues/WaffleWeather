import { describe, expect, it, vi, beforeEach } from "vitest";
import { customFetch } from "./fetcher";

describe("customFetch", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("calls fetch with correct URL and returns data", async () => {
    const mockData = { temp: 22.5 };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        status: 200,
        headers: new Headers(),
        json: () => Promise.resolve(mockData),
      }),
    );

    const result = await customFetch<{ data: unknown; status: number }>("/api/v1/test");
    expect(fetch).toHaveBeenCalledWith("/api/v1/test", expect.objectContaining({
      headers: expect.objectContaining({ "Content-Type": "application/json" }),
    }));
    expect(result.data).toEqual(mockData);
    expect(result.status).toBe(200);
  });

  it("handles 204 No Content", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        status: 204,
        headers: new Headers(),
        json: () => Promise.resolve(null),
      }),
    );

    const result = await customFetch<{ data: unknown; status: number }>("/api/v1/empty");
    expect(result.data).toBeUndefined();
    expect(result.status).toBe(204);
  });

  it("passes custom headers", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        status: 200,
        headers: new Headers(),
        json: () => Promise.resolve({}),
      }),
    );

    await customFetch("/api/v1/test", {
      headers: { "X-Api-Key": "secret" },
    });
    expect(fetch).toHaveBeenCalledWith(
      "/api/v1/test",
      expect.objectContaining({
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          "X-Api-Key": "secret",
        }),
      }),
    );
  });
});
