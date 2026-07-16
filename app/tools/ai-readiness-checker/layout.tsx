import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Readiness Checker — Audit Your Site for AI Search",
  description: "Test your URL instantly to check if AI search engines can crawl, understand, and cite your website. Get a 0-100 score.",
  openGraph: {
    title: "AI Readiness Checker — Audit Your Site for AI Search",
    description: "Test your URL instantly to check if AI search engines can crawl, understand, and cite your website. Get a 0-100 score.",
    type: "website",
    url: "https://geokit.site/tools/ai-readiness-checker",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "AI Readiness Checker",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "All",
  "browserRequirements": "Requires JavaScript",
  "url": "https://geokit.site/tools/ai-readiness-checker",
  "description": "Test your URL instantly to check if AI search engines can crawl, understand, and cite your website."
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
