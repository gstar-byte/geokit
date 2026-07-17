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
      </head>
      <body className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-4">
          <h1 className="text-2xl font-bold text-red-400">Something went wrong!</h1>
          <p className="text-sm text-gray-400">
            An unexpected error occurred. Please try refreshing the page.
          </p>
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-500 transition-colors"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
