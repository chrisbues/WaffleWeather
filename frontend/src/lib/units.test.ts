import { describe, expect, it } from "vitest";
import {
  convertTemp,
  convertSpeed,
  convertPressure,
  convertRain,
  convertRainRate,
  convertDistance,
  convertAltitude,
} from "./units";

describe("convertTemp", () => {
  it("metric passthrough", () => {
    expect(convertTemp(0, "metric")).toEqual({ value: 0, unit: "°C" });
  });

  it("0°C → 32°F", () => {
    expect(convertTemp(0, "imperial")).toEqual({ value: 32, unit: "°F" });
  });

  it("100°C → 212°F", () => {
    expect(convertTemp(100, "imperial")).toEqual({ value: 212, unit: "°F" });
  });

  it("null returns null value", () => {
    expect(convertTemp(null, "metric")).toEqual({ value: null, unit: "°C" });
    expect(convertTemp(null, "imperial")).toEqual({ value: null, unit: "°F" });
  });
});

describe("convertSpeed", () => {
  it("metric passthrough", () => {
    expect(convertSpeed(100, "metric")).toEqual({ value: 100, unit: "km/h" });
  });

  it("100 km/h → ~62.14 mph", () => {
    const result = convertSpeed(100, "imperial");
    expect(result.unit).toBe("mph");
    expect(result.value).toBeCloseTo(62.14, 1);
  });

  it("null returns null value", () => {
    expect(convertSpeed(null, "imperial")).toEqual({ value: null, unit: "mph" });
  });
});

describe("convertPressure", () => {
  it("metric passthrough", () => {
    expect(convertPressure(1013.25, "metric")).toEqual({ value: 1013.25, unit: "hPa" });
  });

  it("1013.25 hPa → ~29.92 inHg", () => {
    const result = convertPressure(1013.25, "imperial");
    expect(result.unit).toBe("inHg");
    expect(result.value).toBeCloseTo(29.92, 1);
  });

  it("null returns null value", () => {
    expect(convertPressure(null, "metric")).toEqual({ value: null, unit: "hPa" });
  });
});

describe("convertRain", () => {
  it("metric passthrough", () => {
    expect(convertRain(25.4, "metric")).toEqual({ value: 25.4, unit: "mm" });
  });

  it("25.4 mm → ~1 in", () => {
    const result = convertRain(25.4, "imperial");
    expect(result.unit).toBe("in");
    expect(result.value).toBeCloseTo(1.0, 1);
  });

  it("null returns null value", () => {
    expect(convertRain(null, "imperial")).toEqual({ value: null, unit: "in" });
  });
});

describe("convertRainRate", () => {
  it("metric passthrough", () => {
    expect(convertRainRate(10, "metric")).toEqual({ value: 10, unit: "mm/h" });
  });

  it("imperial conversion", () => {
    const result = convertRainRate(25.4, "imperial");
    expect(result.unit).toBe("in/h");
    expect(result.value).toBeCloseTo(1.0, 1);
  });

  it("null returns null value", () => {
    expect(convertRainRate(null, "metric")).toEqual({ value: null, unit: "mm/h" });
  });
});

describe("convertDistance", () => {
  it("metric passthrough", () => {
    expect(convertDistance(10, "metric")).toEqual({ value: 10, unit: "km" });
  });

  it("10 km → ~6.21 mi", () => {
    const result = convertDistance(10, "imperial");
    expect(result.unit).toBe("mi");
    expect(result.value).toBeCloseTo(6.21, 1);
  });

  it("null returns null value", () => {
    expect(convertDistance(null, "imperial")).toEqual({ value: null, unit: "mi" });
  });
});

describe("convertAltitude", () => {
  it("metric passthrough", () => {
    expect(convertAltitude(100, "metric")).toEqual({ value: 100, unit: "m" });
  });

  it("100 m → ~328 ft", () => {
    const result = convertAltitude(100, "imperial");
    expect(result.unit).toBe("ft");
    expect(result.value).toBeCloseTo(328.08, 0);
  });

  it("null returns null value", () => {
    expect(convertAltitude(null, "metric")).toEqual({ value: null, unit: "m" });
  });
});
