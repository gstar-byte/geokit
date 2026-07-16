import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Schema for AI Generator — AI-Friendly JSON-LD Markup",
  description: "Create structured JSON-LD schema markup optimized for AI models, helping ChatGPT, Gemini, and Perplexity parse your content.",
  openGraph: {
    title: "Schema for AI Generator — AI-Friendly JSON-LD Markup",
    description: "Create structured JSON-LD schema markup optimized for AI models, helping ChatGPT, Gemini, and Perplexity parse your content.",
    type: "website",
    url: "https://geokit.site/tools/schema-generator",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Schema for AI Generator",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "All",
  "browserRequirements": "Requires JavaScript",
  "url": "https://geokit.site/tools/schema-generator",
  "description": "Create structured JSON-LD schema markup optimized for AI models, helping ChatGPT, Gemini, and Perplexity parse your content."
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
