import { describe, expect, it, vi, beforeEach } from "vitest";
import { ApiError, customFetch } from "./fetcher";

describe("customFetch", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("calls fetch with correct URL and returns data", async () => {
    const mockData = { temp: 22.5 };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify(mockData), {
          status: 200,
          headers: { "content-type": "application/json" },
        }),
      ),
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
      vi.fn().mockResolvedValue(new Response(null, { status: 204 })),
    );

    const result = await customFetch<{ data: unknown; status: number }>("/api/v1/empty");
    expect(result.data).toBeUndefined();
    expect(result.status).toBe(204);
  });

  it("passes custom headers", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({}), {
          status: 200,
          headers: { "content-type": "application/json" },
        }),
      ),
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

describe("customFetch error handling", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("throws ApiError on 500 with status in message", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(() =>
        Promise.resolve(
          new Response(JSON.stringify({ detail: "boom" }), {
            status: 500,
            headers: { "content-type": "application/json" },
          }),
        ),
      ),
    );
    await expect(customFetch("/x")).rejects.toBeInstanceOf(ApiError);
    await expect(customFetch("/x")).rejects.toThrow(/500/);
  });

  it("throws ApiError on 400 with JSON detail body preserved", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ detail: "bad request" }), {
          status: 400,
          headers: { "content-type": "application/json" },
        }),
      ),
    );
    try {
      await customFetch("/x");
      throw new Error("expected customFetch to reject");
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError);
      expect((err as ApiError).status).toBe(400);
      expect((err as ApiError).body).toEqual({ detail: "bad request" });
    }
  });

  it("throws ApiError on 404 (not returning as data)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(() =>
        Promise.resolve(
          new Response(JSON.stringify({ detail: "not found" }), {
            status: 404,
            headers: { "content-type": "application/json" },
          }),
        ),
      ),
    );
    await expect(customFetch("/x")).rejects.toBeInstanceOf(ApiError);
    await expect(customFetch("/x")).rejects.toMatchObject({ status: 404 });
  });

  it("handles non-JSON error response without re-throwing SyntaxError", async () => {
    // Each call must produce a fresh Response — bodies are single-use streams.
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(() =>
        Promise.resolve(
          new Response("Internal Server Error", {
            status: 500,
            headers: { "content-type": "text/plain" },
          }),
        ),
      ),
    );
    // Should throw ApiError, not SyntaxError from failed JSON parse.
    await expect(customFetch("/x")).rejects.toBeInstanceOf(ApiError);
    try {
      await customFetch("/x");
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError);
      expect((err as ApiError).body).toBe("Internal Server Error");
    }
  });

  it("preserves method + URL in error message", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("oops", { status: 403 })),
    );
    try {
      await customFetch("/api/v1/observations", { method: "GET" });
      throw new Error("expected customFetch to reject");
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError);
      expect((err as Error).message).toMatch(/GET/);
      expect((err as Error).message).toMatch(/\/api\/v1\/observations/);
      expect((err as Error).message).toMatch(/403/);
    }
  });

  it("does not throw on 2xx responses", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ ok: true }), {
          status: 201,
          headers: { "content-type": "application/json" },
        }),
      ),
    );
    const result = await customFetch<{ data: unknown; status: number }>("/x");
    expect(result.status).toBe(201);
    expect(result.data).toEqual({ ok: true });
  });

  it("ApiError name is 'ApiError' for instanceof-friendly catching", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(null, { status: 500 }),
      ),
    );
    try {
      await customFetch("/x");
    } catch (err) {
      expect((err as Error).name).toBe("ApiError");
    }
  });
});
