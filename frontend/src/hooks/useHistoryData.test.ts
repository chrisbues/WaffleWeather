import { describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { wrapper } from "@/test/wrappers";
import { useHistoryData } from "./useHistoryData";

// Mock all generated hooks
vi.mock("@/generated/observations/observations", () => ({
  useListObservations: vi.fn().mockReturnValue({
    data: {
      data: {
        items: [
          {
            timestamp: "2026-04-05T12:00:00Z",
            temp_outdoor: 22,
            humidity_outdoor: 65,
            pressure_rel: 1013,
            wind_speed: 12,
            wind_gust: 18,
            rain_daily: 2.5,
            solar_radiation: 450,
            uv_index: 5,
          },
        ],
      },
    },
    isLoading: false,
  }),
}));

vi.mock("@/generated/aggregates/aggregates", () => ({
  useListHourlyObservations: vi.fn().mockReturnValue({
    data: {
      data: [
        {
          bucket: "2026-04-05T12:00:00Z",
          temp_outdoor_avg: 22,
          temp_outdoor_min: 18,
          temp_outdoor_max: 26,
          humidity_outdoor_avg: 65,
          pressure_rel_avg: 1013,
          wind_speed_avg: 12,
          wind_gust_max: 18,
          rain_daily_max: 2.5,
          solar_radiation_avg: 450,
          uv_index_max: 5,
        },
      ],
    },
    isLoading: false,
  }),
  useListDailyObservations: vi.fn().mockReturnValue({
    data: { data: [] },
    isLoading: false,
  }),
  useListMonthlyObservations: vi.fn().mockReturnValue({
    data: { data: [] },
    isLoading: false,
  }),
  useGetCalendarData: vi.fn().mockReturnValue({
    data: undefined,
    isLoading: false,
  }),
}));

describe("useHistoryData", () => {
  it("returns raw resolution for 24h range", () => {
    const { result } = renderHook(() => useHistoryData("24h"), { wrapper });
    expect(result.current.resolution).toBe("raw");
  });

  it("returns hourly resolution for 7d range", () => {
    const { result } = renderHook(() => useHistoryData("7d"), { wrapper });
    expect(result.current.resolution).toBe("hourly");
  });

  it("returns daily resolution for 30d range", () => {
    const { result } = renderHook(() => useHistoryData("30d"), { wrapper });
    expect(result.current.resolution).toBe("daily");
  });

  it("returns monthly resolution for 1y range", () => {
    const { result } = renderHook(() => useHistoryData("1y"), { wrapper });
    expect(result.current.resolution).toBe("monthly");
  });

  it("maps raw observation fields correctly for 24h", () => {
    const { result } = renderHook(() => useHistoryData("24h"), { wrapper });
    expect(result.current.data.length).toBeGreaterThan(0);
    const point = result.current.data[0];
    expect(point.time).toBe("2026-04-05T12:00:00Z");
    expect(point.temp_avg).toBe(22);
    expect(point.humidity_avg).toBe(65);
  });

  it("includes isLoading state", () => {
    const { result } = renderHook(() => useHistoryData("24h"), { wrapper });
    expect(result.current.isLoading).toBe(false);
  });
});
