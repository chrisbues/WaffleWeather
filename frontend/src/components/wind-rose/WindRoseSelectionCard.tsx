"use client";

import type { SelectedWedge } from "./WindRoseChart";

interface Props {
  selection: SelectedWedge | null;
  totalObs: number;
}

export default function WindRoseSelectionCard({ selection, totalObs: _totalObs }: Props) {
  return (
    <div className="weather-card rounded-xl p-5">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
        Selection
      </h3>
      {selection === null ? (
        <p className="text-sm text-text-faint">
          Hover or tap a segment to see details.
        </p>
      ) : (
        <div />
      )}
    </div>
  );
}
