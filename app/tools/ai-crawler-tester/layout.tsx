import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Crawler Tester — How AI Bots See Your Page | GEOKit",
  description:
    "Simulate how AI crawlers (GPTBot, ClaudeBot, PerplexityBot) perceive your website. See what content they can extract, what they miss, and get actionable recommendations. Free AI crawler simulation tool.",
  keywords: [
    "AI crawler tester",
    "GPTBot simulator",
    "ClaudeBot test",
    "PerplexityBot test",
    "how AI sees my website",
    "AI crawler simulation",
  ],
  openGraph: {
    title: "AI Crawler Tester — How AI Bots See Your Page | GEOKit",
    description:
      "Simulate how AI crawlers perceive your website. Free online tool.",
    type: "website",
  },
  alternates: {
    canonical: "/tools/ai-crawler-tester",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
