import type { Observation } from "@/generated/models";

export function makeObservation(overrides?: Partial<Observation>): Observation {
  return {
    timestamp: "2026-04-05T12:00:00Z",
    station_id: "test-station",
    temp_outdoor: 22.5,
    temp_indoor: 21.0,
    humidity_outdoor: 65,
    humidity_indoor: 45,
    pressure_abs: 1010.0,
    pressure_rel: 1013.25,
    wind_speed: 12.0,
    wind_gust: 18.5,
    wind_dir: 225,
    rain_rate: 0.0,
    rain_daily: 2.5,
    rain_weekly: 15.0,
    rain_monthly: 45.0,
    rain_yearly: 320.0,
    solar_radiation: 450,
    uv_index: 5.2,
    dewpoint: 15.5,
    feels_like: 22.5,
    heat_index: null,
    wind_chill: null,
    utci: 22.0,
    lightning_count: 3,
    lightning_distance: 14.0,
    lightning_time: "2026-04-05T11:45:00Z",
    zambretti_forecast: "Settled fine",
    ...overrides,
  };
}
