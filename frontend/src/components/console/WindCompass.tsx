"use client";

import { fmt, degToCompass } from "@/lib/utils";
import { convertSpeed } from "@/lib/units";
import type { UnitSystem } from "@/lib/units";
import VFDDisplay from "./VFDDisplay";

const CARDINALS: [number, string][] = [[0, "N"], [90, "E"], [180, "S"], [270, "W"]];
const INTERCARDINALS: [number, string][] = [[45, "NE"], [135, "SE"], [225, "SW"], [315, "NW"]];
const MINOR_TICKS = [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5];

// Outer ring geometry — dot sits directly on this radius
const CX = 80;
const CY = 80;
const RING_R = 70;

interface WindCompassProps {
  direction: number | null | undefined;
  speed: number | null | undefined;
  gust: number | null | undefined;
  system: UnitSystem;
}

export default function WindCompass({ direction, speed, gust, system }: WindCompassProps) {
  const hasDeg = direction != null;
  const spd = convertSpeed(speed, system);
  const gst = convertSpeed(gust, system);

  return (
    <div className="flex flex-col items-center gap-1">
      {/* Direction label */}
      <span className="font-mono text-xs tracking-[0.15em] vfd-glow-dim">
        {hasDeg ? degToCompass(direction) : "\u2014"}
      </span>

      {/* Compass with centered speed readout overlay (Davis-style) */}
      <div className="relative w-full max-w-[160px]">
        <svg viewBox="0 0 160 160" className="w-full vfd-svg-glow">
          {/* Outer ring */}
          <circle cx={CX} cy={CY} r={RING_R} fill="none" stroke="#d4a574" strokeWidth="0.75" opacity="0.3" />

          {/* Minor ticks */}
          {MINOR_TICKS.map((a) => (
            <line
              key={a}
              x1="80" y1="14" x2="80" y2="18"
              stroke="rgba(212, 165, 116, 0.2)"
              strokeWidth="0.5"
              transform={`rotate(${a} 80 80)`}
            />
          ))}

          {/* Intercardinal ticks + labels */}
          {INTERCARDINALS.map(([angle, label]) => {
            const r = 56;
            const rad = ((angle - 90) * Math.PI) / 180;
            return (
              <g key={label}>
                <line
                  x1="80" y1="12" x2="80" y2="20"
                  stroke="rgba(212, 165, 116, 0.25)"
                  strokeWidth="0.75"
                  transform={`rotate(${angle} 80 80)`}
                />
                <text
                  x={80 + r * Math.cos(rad)}
                  y={80 + r * Math.sin(rad)}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#a88860"
                  fontSize="7"
                  style={{ fontFamily: "var(--font-ibm-plex-mono)" }}
                >
                  {label}
                </text>
              </g>
            );
          })}

          {/* Cardinal labels */}
          {CARDINALS.map(([angle, label]) => {
            const r = 56;
            const rad = ((angle - 90) * Math.PI) / 180;
            return (
              <g key={label}>
                <line
                  x1="80" y1="10" x2="80" y2="20"
                  stroke={label === "N" ? "#d4a574" : "rgba(212, 165, 116, 0.35)"}
                  strokeWidth="1"
                  transform={`rotate(${angle} 80 80)`}
                />
                <text
                  x={80 + r * Math.cos(rad)}
                  y={80 + r * Math.sin(rad)}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={label === "N" ? "#e8c49a" : "#a88860"}
                  fontSize="10"
                  fontWeight={label === "N" ? "600" : "400"}
                  style={{ fontFamily: "var(--font-ibm-plex-mono)" }}
                >
                  {label}
                </text>
              </g>
            );
          })}

          {/* Direction marker: dot sitting on the outer ring.
              Dot is drawn at the 12-o'clock position (top of ring) and the wrapping
              <g> rotates to the bearing — we transition the transform so the dot eases
              around the ring smoothly. */}
          {hasDeg && (
            <g
              className="console-compass-dot"
              style={{ transform: `rotate(${direction}deg)`, transformOrigin: `${CX}px ${CY}px` }}
            >
              <circle cx={CX} cy={CY - RING_R} r="3.5" fill="#e8c49a" />
            </g>
          )}
        </svg>

        {/* Centered speed + unit overlay (Davis-style — inside the ring) */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <VFDDisplay value={fmt(spd.value)} size="lg" pulse />
          <span className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.2em] vfd-glow-dim">
            {spd.unit}
          </span>
        </div>
      </div>

      {/* Gust (below the ring) */}
      <div className="flex items-center gap-1.5">
        <span className="font-mono text-[10px] tracking-wider vfd-glow-dim">GUST</span>
        <VFDDisplay value={fmt(gst.value)} size="sm" unit={gst.unit} />
      </div>
    </div>
  );
}
