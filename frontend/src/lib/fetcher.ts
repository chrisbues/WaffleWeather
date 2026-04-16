/**
 * Custom fetcher for Orval-generated API client.
 * Returns { data, status, headers } to match Orval's expected response shape.
 * Throws {@link ApiError} on non-2xx responses so React Query surfaces a typed
 * error (instead of resolving with a malformed shape or re-throwing a raw
 * SyntaxError from `response.json()` on a non-JSON body).
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: unknown,
    message?: string,
  ) {
    super(message ?? `API error ${status}`);
    this.name = "ApiError";
  }
}

export const customFetch = async <T>(
  url: string,
  options?: RequestInit,
): Promise<T> => {
  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    // Try to parse JSON body; fall back to text so a non-JSON error payload
    // (e.g. an nginx 502 HTML page) doesn't cause a secondary SyntaxError.
    let body: unknown = null;
    const contentType = response.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      body = await response.json().catch(() => null);
    } else {
      body = await response.text().catch(() => null);
    }
    const method = options?.method ?? "GET";
    throw new ApiError(
      response.status,
      body,
      `${method} ${url} -> ${response.status}`,
    );
  }

  const data = response.status === 204 ? undefined : await response.json();

  return {
    data,
    status: response.status,
    headers: response.headers,
  } as T;
};
