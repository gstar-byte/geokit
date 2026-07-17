"use client";

import { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Component Error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
      <h2 className="text-2xl font-bold text-white mb-3">Something went wrong</h2>
      <p className="text-gray-400 max-w-md mb-6 text-sm">
        An error occurred while loading this page section.
      </p>
      <button
        onClick={() => reset()}
        className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-500 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
