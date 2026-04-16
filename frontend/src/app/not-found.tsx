import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="font-display text-6xl font-semibold text-text">404</h1>
      <p className="max-w-sm text-sm text-text-muted">
        That page doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-lg border border-border bg-surface-alt px-5 py-2.5 text-sm font-medium text-text transition-colors hover:bg-surface-hover"
      >
        Return to Observatory
      </Link>
    </div>
  );
}
