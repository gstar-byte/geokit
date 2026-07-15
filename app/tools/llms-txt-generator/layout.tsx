import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "llms.txt Generator — Free Online Tool | GEOKit",
  description:
    "Generate an llms.txt file for your website in seconds. Tell AI models like ChatGPT, Perplexity, and Google AI Overviews what your site is about and which pages matter most. Free, no signup.",
  keywords: [
    "llms.txt generator",
    "llms.txt creator",
    "generate llms.txt",
    "AI content file",
    "LLM website summary",
    "GEO tool",
  ],
  openGraph: {
    title: "llms.txt Generator — Free Online Tool | GEOKit",
    description:
      "Generate an llms.txt file that tells AI models what your site is about. Free, no signup.",
    type: "website",
  },
  alternates: {
    canonical: "/tools/llms-txt-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
