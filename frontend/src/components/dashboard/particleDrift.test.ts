import { describe, it, expect, beforeEach } from "vitest";
import { ParticleDrift, gustPulseAt } from "./particleDrift";

describe("ParticleDrift", () => {
  let drift: ParticleDrift;

  beforeEach(() => {
    drift = new ParticleDrift();
  });

  it("spawns no particles when speed is 0", () => {
    drift.update(0.5, 0, null, 180, 1000);
    expect(drift.particles).toHaveLength(0);
  });

  it("spawns no particles when speed is below threshold", () => {
    drift.update(0.5, 0.5, null, 180, 1000);
    expect(drift.particles).toHaveLength(0);
  });

  it("spawns more particles at higher speed", () => {
    const slow = new ParticleDrift();
    const fast = new ParticleDrift();
    for (let i = 0; i < 60; i++) {
      slow.update(1 / 60, 8, null, 180, i * 16);
      fast.update(1 / 60, 48, null, 180, i * 16);
    }
    expect(fast.particles.length).toBeGreaterThan(slow.particles.length);
  });

  it("spawns particles within the clip circle", () => {
    drift.update(0.5, 32, null, 180, 0);
    for (const p of drift.particles) {
      const dx = p.x - 100;
      const dy = p.y - 100;
      const dist = Math.sqrt(dx * dx + dy * dy);
      expect(dist).toBeLessThanOrEqual(60);
    }
  });

  it("removes particles that exit the clip circle", () => {
    drift.update(0.5, 32, null, 180, 0);
    const initial = drift.particles.length;
    expect(initial).toBeGreaterThan(0);
    for (let i = 0; i < 300; i++) {
      drift.update(1 / 60, 0, null, 180, 1000 + i * 16);
    }
    expect(drift.particles.length).toBeLessThan(initial);
  });

  it("gustPulseAt returns 0 when gust is null", () => {
    expect(gustPulseAt(16, null, 500)).toBe(0);
  });

  it("gustPulseAt returns 0 when gust is below speed", () => {
    expect(gustPulseAt(32, 16, 500)).toBe(0);
  });

  it("gustPulseAt oscillates between 0 and 1 when gust exceeds speed", () => {
    // sin(0) = 0, pulse = (0+1)/2 = 0.5
    expect(gustPulseAt(16, 32, 0)).toBeCloseTo(0.5, 5);
    // sin(π/2) ≈ 1, pulse ≈ 1 — peak at timeMs ≈ π/2 / 0.002 ≈ 785ms
    expect(gustPulseAt(16, 32, 785)).toBeCloseTo(1, 1);
    // sin(3π/2) ≈ -1, pulse ≈ 0 — trough at timeMs ≈ 2356ms
    expect(gustPulseAt(16, 32, 2356)).toBeCloseTo(0, 1);
  });

  it("does not apply gust pulse when gust is below speed", () => {
    const noGust = new ParticleDrift();
    const lowGust = new ParticleDrift();
    for (let i = 0; i < 120; i++) {
      noGust.update(1 / 60, 16, null, 180, i * 16);
      lowGust.update(1 / 60, 16, 8, 180, i * 16);
    }
    const diff = Math.abs(noGust.particles.length - lowGust.particles.length);
    expect(diff).toBeLessThan(5);
  });

  it("clear() empties all particles and resets accumulator", () => {
    drift.update(0.5, 32, null, 180, 0);
    expect(drift.particles.length).toBeGreaterThan(0);
    drift.clear();
    expect(drift.particles).toHaveLength(0);
  });
});
