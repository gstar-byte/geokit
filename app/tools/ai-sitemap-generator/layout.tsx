import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Sitemap Generator — XML Sitemap for AI Bots",
  description: "Generate XML sitemaps optimized for AI crawler indexing, highlighting key content priorities and update rates.",
  openGraph: {
    title: "AI Sitemap Generator — XML Sitemap for AI Bots",
    description: "Generate XML sitemaps optimized for AI crawler indexing, highlighting key content priorities and update rates.",
    type: "website",
    url: "https://geokit.site/tools/ai-sitemap-generator",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "AI Sitemap Generator",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "All",
  "browserRequirements": "Requires JavaScript",
  "url": "https://geokit.site/tools/ai-sitemap-generator",
  "description": "Generate XML sitemaps optimized for AI crawler indexing, highlighting key content priorities and update rates."
};

export default function ToolLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
