"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[WaffleWeather global error]", error);
  }, [error]);

  // Inline styles: global-error replaces the root layout, so Tailwind / global
  // styles / fonts may not be available if the app crashed badly enough. These
  // colors approximate the "Warm Observatory" light palette so the fallback
  // still feels like part of the app.
  return (
    <html lang="en">
      <body>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            padding: "1.5rem",
            textAlign: "center",
            background: "#faf7f2",
            color: "#2c231a",
            fontFamily:
              '"Fraunces", ui-serif, Georgia, serif',
          }}
        >
          <h1 style={{ fontSize: "2rem", fontWeight: 600, margin: 0 }}>
            App crashed
          </h1>
          <p
            style={{
              maxWidth: "24rem",
              fontSize: "0.875rem",
              color: "#7a6e5e",
              fontFamily:
                '"Outfit", ui-sans-serif, system-ui, sans-serif',
              margin: 0,
            }}
          >
            {error.message || "A fatal error occurred."}
          </p>
          {error.digest && (
            <p
              style={{
                fontSize: "0.75rem",
                color: "#968a7a",
                fontFamily:
                  '"IBM Plex Mono", ui-monospace, monospace',
                margin: 0,
              }}
            >
              digest: {error.digest}
            </p>
          )}
          <button
            onClick={reset}
            style={{
              marginTop: "0.5rem",
              padding: "0.625rem 1.25rem",
              border: "1px solid #d8d0c4",
              borderRadius: "0.5rem",
              background: "#f0ece4",
              color: "#2c231a",
              fontSize: "0.875rem",
              fontWeight: 500,
              cursor: "pointer",
              fontFamily:
                '"Outfit", ui-sans-serif, system-ui, sans-serif',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
