import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "llms.txt Generator — Free GEO Tools for AI Optimization",
  description: "Generate a standardized llms.txt file to help LLMs and AI crawlers understand your site structure and index relevant content.",
  openGraph: {
    title: "llms.txt Generator — Free GEO Tools for AI Optimization",
    description: "Generate a standardized llms.txt file to help LLMs and AI crawlers understand your site structure and index relevant content.",
    type: "website",
    url: "https://geokit.site/tools/llms-txt-generator",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "llms.txt Generator",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "All",
  "browserRequirements": "Requires JavaScript",
  "url": "https://geokit.site/tools/llms-txt-generator",
  "description": "Generate a standardized llms.txt file to help LLMs and AI crawlers understand your site structure and index relevant content."
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
