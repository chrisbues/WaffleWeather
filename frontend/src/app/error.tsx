"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface to console so users can relay info; could also ping a telemetry endpoint
    console.error("[WaffleWeather error boundary]", error);
  }, [error]);

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="font-display text-3xl font-semibold text-text">
        Something broke
      </h1>
      <p className="max-w-sm text-sm text-text-muted">
        {error.message || "An unexpected error occurred rendering this page."}
      </p>
      {error.digest && (
        <p className="font-mono text-xs text-text-faint">
          digest: {error.digest}
        </p>
      )}
      <button
        onClick={reset}
        className="mt-2 rounded-lg border border-border bg-surface-alt px-5 py-2.5 text-sm font-medium text-text transition-colors hover:bg-surface-hover"
      >
        Try again
      </button>
    </div>
  );
}
