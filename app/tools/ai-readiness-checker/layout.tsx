import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Readiness Checker — Score Your Site for AI Search | GEOKit",
  description:
    "Get an instant 0-100 AI readiness score. Checks robots.txt, llms.txt, structured data, meta tags & more. Free, no signup.",
  keywords: [
    "AI readiness checker",
    "AI SEO audit",
    "AI search readiness",
    "GEO score",
    "AI optimization check",
    "ChatGPT visibility check",
  ],
  openGraph: {
    title: "AI Readiness Checker — Score Your Site for AI Search | GEOKit",
    description:
      "Get an instant 0-100 AI readiness score for your website. Free, no signup.",
    type: "website",
  },
  alternates: {
    canonical: "/tools/ai-readiness-checker",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
