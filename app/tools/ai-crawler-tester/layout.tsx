import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Crawler Tester — Simulate LLM Scrapers",
  description: "Simulate crawler requests from GPTBot, ClaudeBot, and other LLMs to analyze how AI models view and extract your raw page content.",
  openGraph: {
    title: "AI Crawler Tester — Simulate LLM Scrapers",
    description: "Simulate crawler requests from GPTBot, ClaudeBot, and other LLMs to analyze how AI models view and extract your raw page content.",
    type: "website",
    url: "https://geokit.site/tools/ai-crawler-tester",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "AI Crawler Tester",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "All",
  "browserRequirements": "Requires JavaScript",
  "url": "https://geokit.site/tools/ai-crawler-tester",
  "description": "Simulate crawler requests from GPTBot, ClaudeBot, and other LLMs to analyze how AI models view and extract your raw page content."
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
