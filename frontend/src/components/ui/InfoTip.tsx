"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

interface InfoTipProps {
  text: string;
  /** Preferred placement — auto-flips if clipped */
  side?: "top" | "bottom";
}

export default function InfoTip({ text, side = "top" }: InfoTipProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const [placement, setPlacement] = useState(side);
  const [leftOffset, setLeftOffset] = useState(0);
  const prevOffset = useRef(0);

  // Close on outside click (mobile tap-to-toggle)
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [open]);

  // Reset offset when closing so next open starts fresh
  useEffect(() => {
    if (!open) {
      prevOffset.current = 0;
      setLeftOffset(0);
    }
  }, [open]);

  // Auto-flip vertically and nudge horizontally if tooltip would go off-screen
  // useLayoutEffect runs before paint so the tooltip doesn't visibly snap
  useLayoutEffect(() => {
    if (!open || !tooltipRef.current) return;
    const rect = tooltipRef.current.getBoundingClientRect();
    if (side === "top" && rect.top < 8) {
      setPlacement("bottom");
    } else if (side === "bottom" && rect.bottom > window.innerHeight - 8) {
      setPlacement("top");
    } else {
      setPlacement(side);
    }
    // Horizontal nudge: keep tooltip within visible content area
    // Subtract current offset to get the "natural" (centered) position
    const naturalLeft = rect.left - prevOffset.current;
    const naturalRight = rect.right - prevOffset.current;
    const pad = 36;
    const main = tooltipRef.current.closest("main");
    const minLeft = main ? main.getBoundingClientRect().left + pad : pad;
    const maxRight = window.innerWidth - pad;
    let newOffset = 0;
    if (naturalLeft < minLeft) {
      newOffset = Math.round(minLeft - naturalLeft);
    } else if (naturalRight > maxRight) {
      newOffset = Math.round(maxRight - naturalRight);
    }
    prevOffset.current = newOffset;
    setLeftOffset(newOffset);
  }, [open, side]);

  const toggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen((v) => !v);
  }, []);

  return (
    <span ref={ref} className="info-tip-wrap">
      <button
        type="button"
        onClick={toggle}
        aria-label="More info"
        className="info-tip-trigger"
      >
        <svg viewBox="0 0 14 14" fill="none" className="info-tip-icon">
          <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.25" />
          <path
            d="M7 6.2V10"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
          />
          <circle cx="7" cy="4.25" r="0.75" fill="currentColor" />
        </svg>
      </button>
      {open && (
        <span
          ref={tooltipRef}
          className={`info-tip-bubble info-tip-${placement}`}
          role="tooltip"
          style={leftOffset ? { marginLeft: leftOffset } : undefined}
        >
          {text}
          <span
            className={`info-tip-caret info-tip-caret-${placement}`}
            style={leftOffset ? { marginLeft: -leftOffset } : undefined}
          />
        </span>
      )}
    </span>
  );
}
