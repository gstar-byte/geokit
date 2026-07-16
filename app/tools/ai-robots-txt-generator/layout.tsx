import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Robots.txt Generator — Control LLM Crawlers",
  description: "Generate a production-ready robots.txt to allow or block AI training bots like GPTBot, ClaudeBot, and PerplexityBot.",
  openGraph: {
    title: "AI Robots.txt Generator — Control LLM Crawlers",
    description: "Generate a production-ready robots.txt to allow or block AI training bots like GPTBot, ClaudeBot, and PerplexityBot.",
    type: "website",
    url: "https://geokit.site/tools/ai-robots-txt-generator",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "AI Robots.txt Generator",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "All",
  "browserRequirements": "Requires JavaScript",
  "url": "https://geokit.site/tools/ai-robots-txt-generator",
  "description": "Generate a production-ready robots.txt to allow or block AI training bots like GPTBot, ClaudeBot, and PerplexityBot."
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
