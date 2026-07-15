import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Q&A Content Formatter — AI-Friendly FAQ Generator | GEOKit",
  description:
    "Transform your content into Q&A format that AI models naturally parse and cite. Outputs HTML with FAQPage schema, Markdown, or JSON-LD. Boost your visibility in ChatGPT, Perplexity, and Google AI Overviews.",
  keywords: [
    "Q&A content formatter",
    "FAQ generator",
    "FAQPage schema generator",
    "AI content formatter",
    "question answer format",
    "AI citation content",
  ],
  openGraph: {
    title: "Q&A Content Formatter — AI-Friendly FAQ Generator | GEOKit",
    description:
      "Convert content into AI-friendly Q&A format with FAQPage schema. Free online tool.",
    type: "website",
  },
  alternates: {
    canonical: "/tools/qa-content-formatter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
