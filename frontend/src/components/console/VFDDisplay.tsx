"use client";

import { cn } from "@/lib/utils";

const SIZE_CLASSES = {
  xl: "text-5xl",
  lg: "text-4xl",
  md: "text-2xl",
  sm: "text-lg",
} as const;

const UNIT_SIZE_CLASSES = {
  xl: "text-xl",
  lg: "text-lg",
  md: "text-sm",
  sm: "text-xs",
} as const;

interface VFDDisplayProps {
  value: string;
  size?: keyof typeof SIZE_CLASSES;
  ghostDigits?: number;
  unit?: string;
  pulse?: boolean;
  className?: string;
}

export default function VFDDisplay({
  value,
  size = "md",
  ghostDigits,
  unit,
  pulse = false,
  className,
}: VFDDisplayProps) {
  // Build ghost string: replace digits with 8, keep . and - and spaces
  const ghost = ghostDigits
    ? "8".repeat(ghostDigits)
    : value.replace(/[0-9]/g, "8");

  return (
    <span className={cn("inline-flex items-baseline gap-1.5", className)}>
      <span className="relative inline-block">
        {/* Ghost (unlit segments) layer */}
        <span
          className={cn("vfd-ghost tabular-nums", SIZE_CLASSES[size])}
          style={{ fontFamily: "var(--font-dseg7), var(--font-ibm-plex-mono), monospace" }}
          aria-hidden="true"
        >
          {ghost}
        </span>
        {/* Active segments layer */}
        <span
          className={cn(
            "absolute inset-0 tabular-nums",
            SIZE_CLASSES[size],
            "vfd-glow",
            pulse && "vfd-pulse",
          )}
          style={{ fontFamily: "var(--font-dseg7), var(--font-ibm-plex-mono), monospace" }}
        >
          {value}
        </span>
      </span>
      {unit && (
        <span
          className={cn("font-mono vfd-glow-dim", UNIT_SIZE_CLASSES[size])}
        >
          {unit}
        </span>
      )}
    </span>
  );
}
