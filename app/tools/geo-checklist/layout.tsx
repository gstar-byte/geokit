import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GEO Checklist — AI Search Optimization Guide | GEOKit",
  description:
    "A comprehensive checklist to optimize your website for AI search. Track progress across content discovery, structured data, on-page SEO & more. Free.",
  keywords: [
    "GEO checklist",
    "AI SEO checklist",
    "generative engine optimization checklist",
    "AI search optimization guide",
    "GEO audit checklist",
  ],
  openGraph: {
    title: "GEO Checklist — AI Search Optimization Guide | GEOKit",
    description:
      "Checklist to optimize your site for AI search. Track progress, free.",
    type: "website",
  },
  alternates: {
    canonical: "/tools/geo-checklist",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
