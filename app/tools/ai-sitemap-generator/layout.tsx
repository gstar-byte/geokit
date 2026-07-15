import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Sitemap Generator — XML Sitemap for AI Crawlers | GEOKit",
  description:
    "Generate an XML sitemap optimized for AI crawlers. Set priority hints and update frequencies. Free, no signup.",
  keywords: [
    "AI sitemap generator",
    "XML sitemap generator",
    "sitemap for AI crawlers",
    "GPTBot sitemap",
    "sitemap.xml generator",
  ],
  openGraph: {
    title: "AI Sitemap Generator — XML Sitemap for AI Crawlers | GEOKit",
    description:
      "Generate an XML sitemap optimized for AI crawlers. Free online tool.",
    type: "website",
  },
  alternates: {
    canonical: "/tools/ai-sitemap-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
