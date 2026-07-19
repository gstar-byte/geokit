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
    console.error("Global Application Error:", error);
  }, [error]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Application Error — GEOKit</title>
        <meta name="description" content="An unexpected application error occurred on GEOKit." />
      </head>
      <body className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white flex flex-col">
        <main className="flex-1 flex flex-col items-center justify-center p-4 text-center">
          <div className="max-w-md w-full space-y-4">
            <h1 className="text-2xl font-bold text-red-400">Something went wrong!</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              An unexpected error occurred. Please try refreshing the page.
            </p>
            <button
              onClick={() => reset()}
              className="px-4 py-2 bg-brand-600 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-brand-500 transition-colors"
            >
              Try Again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
