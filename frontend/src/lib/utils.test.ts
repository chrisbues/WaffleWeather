import { describe, expect, it } from "vitest";
import { cn, fmt, degToCompass, timeAgo } from "./utils";

describe("cn", () => {
  it("merges classes", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible");
  });

  it("merges tailwind conflicts", () => {
    expect(cn("p-4", "p-2")).toBe("p-2");
  });
});

describe("fmt", () => {
  it("formats number with default 1 decimal", () => {
    expect(fmt(22.567)).toBe("22.6");
  });

  it("formats number with custom decimals", () => {
    expect(fmt(22.5, 0)).toBe("23");
    expect(fmt(22.5, 2)).toBe("22.50");
  });

  it("returns em dash for null", () => {
    expect(fmt(null)).toBe("\u2014");
  });

  it("returns em dash for undefined", () => {
    expect(fmt(undefined)).toBe("\u2014");
  });

  it("formats zero", () => {
    expect(fmt(0)).toBe("0.0");
  });
});

describe("degToCompass", () => {
  it("converts 0 to N", () => {
    expect(degToCompass(0)).toBe("N");
  });

  it("converts 90 to E", () => {
    expect(degToCompass(90)).toBe("E");
  });

  it("converts 180 to S", () => {
    expect(degToCompass(180)).toBe("S");
  });

  it("converts 270 to W", () => {
    expect(degToCompass(270)).toBe("W");
  });

  it("wraps at 360", () => {
    expect(degToCompass(360)).toBe("N");
  });

  it("handles intermediate direction", () => {
    expect(degToCompass(45)).toBe("NE");
  });

  it("returns em dash for null", () => {
    expect(degToCompass(null)).toBe("\u2014");
  });

  it("returns em dash for undefined", () => {
    expect(degToCompass(undefined)).toBe("\u2014");
  });
});

describe("timeAgo", () => {
  it("returns 'just now' for recent time", () => {
    const now = new Date().toISOString();
    expect(timeAgo(now)).toBe("just now");
  });

  it("returns minutes ago", () => {
    const fiveMinAgo = new Date(Date.now() - 5 * 60_000).toISOString();
    expect(timeAgo(fiveMinAgo)).toBe("5m ago");
  });

  it("returns hours ago", () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 3600_000).toISOString();
    expect(timeAgo(twoHoursAgo)).toBe("2h ago");
  });

  it("returns days ago", () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 86400_000).toISOString();
    expect(timeAgo(threeDaysAgo)).toBe("3d ago");
  });

  it("returns em dash for null", () => {
    expect(timeAgo(null)).toBe("\u2014");
  });

  it("returns em dash for empty string", () => {
    expect(timeAgo("")).toBe("\u2014");
  });
});
