import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Sitemap Generator — XML Sitemap for AI Crawlers | GEOKit",
  description:
    "Generate an XML sitemap optimized for AI crawlers like GPTBot, ClaudeBot, and PerplexityBot. Set priority hints and update frequencies. Free online sitemap generator with download and copy.",
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
