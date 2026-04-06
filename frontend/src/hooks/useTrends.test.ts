import { describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { wrapper } from "@/test/wrappers";
import { useTrends } from "./useTrends";

// Mock the generated hook
vi.mock("@/generated/observations/observations", () => ({
  useListObservations: vi.fn(),
}));

import { useListObservations } from "@/generated/observations/observations";
const mockUseListObservations = vi.mocked(useListObservations);

describe("useTrends", () => {
  it("returns null trends when no data", () => {
    mockUseListObservations.mockReturnValue({ data: undefined } as ReturnType<typeof useListObservations>);
    const { result } = renderHook(() => useTrends(), { wrapper });
    expect(result.current.temp_outdoor).toBeNull();
    expect(result.current.pressure_rel).toBeNull();
  });

  it("returns null trends when fewer than 2 observations", () => {
    mockUseListObservations.mockReturnValue({
      data: { data: { items: [{ temp_outdoor: 22 }] } },
    } as unknown as ReturnType<typeof useListObservations>);
    const { result } = renderHook(() => useTrends(), { wrapper });
    expect(result.current.temp_outdoor).toBeNull();
  });

  it("returns 'up' when temperature is rising", () => {
    mockUseListObservations.mockReturnValue({
      data: {
        data: {
          items: [
            { temp_outdoor: 24 }, // newest
            { temp_outdoor: 20 }, // oldest
          ],
        },
      },
    } as unknown as ReturnType<typeof useListObservations>);
    const { result } = renderHook(() => useTrends(), { wrapper });
    expect(result.current.temp_outdoor).toBe("up");
  });

  it("returns 'down' when temperature is falling", () => {
    mockUseListObservations.mockReturnValue({
      data: {
        data: {
          items: [
            { temp_outdoor: 18 }, // newest
            { temp_outdoor: 22 }, // oldest
          ],
        },
      },
    } as unknown as ReturnType<typeof useListObservations>);
    const { result } = renderHook(() => useTrends(), { wrapper });
    expect(result.current.temp_outdoor).toBe("down");
  });

  it("returns 'flat' when change is below threshold", () => {
    mockUseListObservations.mockReturnValue({
      data: {
        data: {
          items: [
            { temp_outdoor: 22.1 }, // newest: diff=0.1, threshold=0.2
            { temp_outdoor: 22.0 }, // oldest
          ],
        },
      },
    } as unknown as ReturnType<typeof useListObservations>);
    const { result } = renderHook(() => useTrends(), { wrapper });
    expect(result.current.temp_outdoor).toBe("flat");
  });

  it("detects pressure trends with correct threshold", () => {
    mockUseListObservations.mockReturnValue({
      data: {
        data: {
          items: [
            { pressure_rel: 1014.0 }, // newest: diff=1.0, threshold=0.1
            { pressure_rel: 1013.0 }, // oldest
          ],
        },
      },
    } as unknown as ReturnType<typeof useListObservations>);
    const { result } = renderHook(() => useTrends(), { wrapper });
    expect(result.current.pressure_rel).toBe("up");
  });

  it("returns null for fields with null values", () => {
    mockUseListObservations.mockReturnValue({
      data: {
        data: {
          items: [
            { temp_outdoor: null, wind_speed: 15 },
            { temp_outdoor: 22, wind_speed: 10 },
          ],
        },
      },
    } as unknown as ReturnType<typeof useListObservations>);
    const { result } = renderHook(() => useTrends(), { wrapper });
    expect(result.current.temp_outdoor).toBeNull();
    expect(result.current.wind_speed).toBe("up");
  });
});
