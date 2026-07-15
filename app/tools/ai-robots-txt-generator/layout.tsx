import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Robots.txt Generator — Control AI Crawler Access | GEOKit",
  description:
    "Generate a robots.txt to control AI crawler access (GPTBot, ClaudeBot, PerplexityBot). Presets for allow-all, block-all, or selective. Free.",
  keywords: [
    "AI robots.txt generator",
    "robots.txt for AI",
    "GPTBot robots.txt",
    "ClaudeBot robots.txt",
    "AI crawler control",
    "block AI bots",
  ],
  openGraph: {
    title: "AI Robots.txt Generator — Control AI Crawler Access | GEOKit",
    description:
      "Control which AI crawlers can access your site. Free robots.txt generator for AI SEO.",
    type: "website",
  },
  alternates: {
    canonical: "/tools/ai-robots-txt-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
