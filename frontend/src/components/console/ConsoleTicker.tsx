"use client";

import { useMemo } from "react";

interface ConsoleTickerProps {
  text: string;
}

export default function ConsoleTicker({ text }: ConsoleTickerProps) {
  // Scale duration to text length so scroll speed stays consistent
  const duration = useMemo(() => Math.max(20, text.length * 0.25), [text]);

  return (
    <div className="overflow-hidden">
      <span
        className="ticker-scroll font-mono text-sm tracking-wider vfd-dot-matrix"
        style={{ animationDuration: `${duration}s` }}
      >
        {"\u25B8 "}{text}
      </span>
    </div>
  );
}
