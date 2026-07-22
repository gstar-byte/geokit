import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — GEOKit",
  description:
    "Terms of Service for GEOKit — the free GEO toolkit for AI search optimization. Free for personal and commercial use, no signup required.",
  alternates: {
    canonical: "https://geokit.site/terms",
  },
  openGraph: {
    title: "Terms of Service — GEOKit",
    description:
      "Terms of Service for GEOKit — the free GEO toolkit for AI search optimization. Free for personal and commercial use, no signup required.",
    type: "website",
    url: "https://geokit.site/terms",
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
