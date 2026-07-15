import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GEO Checklist — Step-by-Step AI Search Optimization | GEOKit",
  description:
    "A comprehensive 16-point checklist to optimize your website for AI search engines. Track your progress across AI content discovery, structured data, on-page SEO, technical, content quality, and monitoring. Free.",
  keywords: [
    "GEO checklist",
    "AI SEO checklist",
    "generative engine optimization checklist",
    "AI search optimization guide",
    "GEO audit checklist",
  ],
  openGraph: {
    title: "GEO Checklist — Step-by-Step AI Search Optimization | GEOKit",
    description:
      "16-point checklist to optimize your site for AI search. Track progress, free.",
    type: "website",
  },
  alternates: {
    canonical: "/tools/geo-checklist",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
