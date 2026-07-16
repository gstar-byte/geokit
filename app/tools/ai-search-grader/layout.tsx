import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Search Grader — Test Brand Visibility",
  description: "Query multiple AI models using automated prompts to measure your brand's ranking, visibility, and share of voice.",
  openGraph: {
    title: "AI Search Grader — Test Brand Visibility",
    description: "Query multiple AI models using automated prompts to measure your brand's ranking, visibility, and share of voice.",
    type: "website",
    url: "https://geokit.site/tools/ai-search-grader",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "AI Search Grader",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "All",
  "browserRequirements": "Requires JavaScript",
  "url": "https://geokit.site/tools/ai-search-grader",
  "description": "Query multiple AI models using automated prompts to measure your brand's ranking, visibility, and share of voice."
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
