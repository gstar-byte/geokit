import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 - Page Not Found | GEOKit",
  description: "The page you are looking for does not exist or has been moved.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center px-4">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-brand-500/10 text-brand-400 mb-6 border border-brand-500/20 text-3xl font-bold">
        404
      </div>
      <h1 className="text-3xl font-bold text-white mb-3">Page Not Found</h1>
      <p className="text-gray-400 max-w-md mb-8">
        The page you are looking for does not exist or has been moved. Use the link below to return to the toolkit.
      </p>
      <Link
        href="/"
        className="btn-primary inline-flex items-center gap-2"
      >
        ← Back to Home
      </Link>
    </div>
  );
}
